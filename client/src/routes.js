import Books from './components/Books/Books';
import ChangeLogoUser from './components/ChangeLogoUser/ChangeLogoUser';
import DetailView from './components/DetailView/DetailView';
import FormAddBook from './components/FormAddBook/FormAddBook';
import LoginForm from './components/Login/LoginForm';
import MainInfo from './components/Main/MainInfo';
import NotFoundPage from './components/Notfoundpage/Notfoundpage';
import RegistrationForm from './components/Registration/Registration';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ResetPasswordEmail from './components/ResetPasswordEmail/ResetPasswordEmail';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, MAIN_ROUTE, BOOKS_ROUTE, ADDBOOK_ROUTE, ONEBOOK_ROUTE, CHANGEUSERLOGO_ROUTE, RESET_PASSWORD_EMAIL_ROUTE, RESET_PASSWORD_ROUTE } from './utils/consts'; 


export const authRoutes = [
    {
        path: MAIN_ROUTE,
        element: <MainInfo/>
    },
    {
        path: BOOKS_ROUTE,
        element: <Books/>
    },
    {
        path: '*',
        element: <Books/>
    },
    {
        path: ADDBOOK_ROUTE,
        element: <FormAddBook/>
    },
    {
        path: ONEBOOK_ROUTE,
        element: <DetailView/>
    },
    {
        path: CHANGEUSERLOGO_ROUTE,
        element: <ChangeLogoUser/>
    },
];

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        element: <LoginForm/>
    },
    {
        path: REGISTRATION_ROUTE,
        element: <RegistrationForm/>
    },
    {
        path: MAIN_ROUTE,
        element: <MainInfo/>
    },
    {
        path: '*',
        element: <MainInfo/>
    },

    {
        path: RESET_PASSWORD_EMAIL_ROUTE,
        element: <ResetPasswordEmail/>
    },

    {
        path: RESET_PASSWORD_ROUTE,
        element: <ResetPassword/>
    },
];
