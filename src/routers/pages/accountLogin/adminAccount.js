import React, { useState} from 'react';
import * as Realm from 'realm-web';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import video from '../../../video/work.mp4';
import styles from './styles.module.css'
import LoadingPage from '../loadingPage/loadingPage';

const app = new Realm.App({ id: process.env.REACT_APP_REALM_ID });

const loginSchema = {
  title: 'Login',
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', title: 'Email', format: 'email' },
    password: { type: 'string', title: 'Password', minLength: 6, format: 'password' },
  },
};

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const login = async (form) => {
    const { email, password } = form.formData;
    try {
      const credentials = Realm.Credentials.emailPassword(email, password);
      const loggedInUser = await app.logIn(credentials);

      setLoading(false);
      setUser(loggedInUser);
      setIsLoggedIn(true);
      window.location.reload(true)

    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
       <video autoPlay loop muted className="background-video" onError={(e) => console.log('Video load error:', e)}>
        <source src= {video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {user ? (
        <>
          {isLoggedIn && loading ? <LoadingPage/> : <Account />}
        </>
      ) : (
        <div className={styles.center_wrapper}>
          <div className={styles.overlay_container}>
            <div className={styles.overlay_content}>
              <div className={styles.container_form}>
                <>
                  <Form
                    className={styles.custom_form}
                    schema={loginSchema}
                    validator={validator}
                    onSubmit={login}
                  />
                </>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
