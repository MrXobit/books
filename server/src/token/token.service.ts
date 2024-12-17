import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as jwt from 'jsonwebtoken';
import { Model, ObjectId } from "mongoose";
import { Token, TokenDocument } from "src/user/schemas/token.schema";
import { User, UserDocument } from "src/user/schemas/user.sсhema";




@Injectable()
export class TokenService {
    static validateAccesToken(accessToken: string) {
        throw new Error('Method not implemented.');
    }
    constructor (@InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
) {}

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken, 
            refreshToken
        }
    }

    async saveToken(userId: ObjectId, refreshToken: string) {
        const tokenData = await this.tokenModel.findOne({user: userId})
        if(tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
      const token = await this.tokenModel.create({user: userId, refreshToken})
      return token
    }

    async removeToken(refreshToken: string) {
        const token = await this.tokenModel.findOneAndDelete({refreshToken})
        return token
    }

    async validateAccessToken(token: string) {
        try {
           const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
           return userData
        } catch(e) {
            return null
        }
    }

    async validateRefreshToken(token: string) {
        try {
           const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
           return userData
        } catch(e) {
            return null
        }
    }

    async findToken(refreshToken: string) {
        const tokenData = await this.tokenModel.findOne({refreshToken})
        return tokenData
    }



    async generateToken(payload) {
        const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        const user = await this.userModel.findOne({email: payload.email})
        if (!user) {
            throw new Error('User not found');
        }
        user.resetToken = token
        await user.save();
        return {
            token
        }
    }

    async deleteResetToken (resetToken) {
        const user = await this.userModel.findOne({resetToken})
        user.resetToken = null
        await user.save()
    }

}




