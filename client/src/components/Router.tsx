
// import React, { useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Routes, Route, useNavigate } from 'react-router-dom';
// import { RootState } from '../store/store';
// import { authRoutes, publicRoutes } from '../routes';
// import { BOOKS_ROUTE } from '../utils/consts';
// import Loading from './Loading/Loading';
// const Router = () => {
//   const { isAuth } = useSelector((state: RootState) => state.user);
//   const { user } = useSelector((state: RootState) => state.user);
//   const { isLoading } = useSelector((state: RootState) => state.user);
//   return (<div>
// {isLoading ? <div>
//   <Loading/>
// </div>

// : <div>
//         <Routes>
// {isAuth && user.isActivated 
//   ? authRoutes.map(({ path, element }) => (
//       <Route key={path} path={path} element={element} />
//     ))
//   : publicRoutes.map(({ path, element }) => (
//       <Route key={path} path={path} element={element} />
//     ))
// }
//       </Routes>
//   </div>}
//          </div>

//   );
// };

// export default Router;




import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { authRoutes, publicRoutes } from '../routes';
import Loading from './Loading/Loading';

const Router = () => {
  const [isLoaded, setIsLoaded] = useState(false); 
  const { isAuth, isLoading } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!isLoading) {
      setIsLoaded(true);
    }
  }, [isLoading]);

  if (!isLoaded) {
    return (
      <div>
        <Loading /> 
      </div>
    );
  }

  return (
    <div>
      <Routes>
        {isAuth && user.isActivated
          ? authRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))
          : publicRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
      </Routes>
    </div>
  );
};

export default Router;

