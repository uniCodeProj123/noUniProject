var passport = require('passport'),
       LocalStrategy = require('passport-local').Strategy,
       user = {
         // This a hard-coded user
           _id: 1,
           username: 'admin',
           email: 'admin@bookstore.com',
           password: 'adminPassword'
       };


        global.authenticateUser = false;

   // Register a login strategy
   passport.use('login', new LocalStrategy(
       function(username, password, done) {
           // checks against hardcoded user (replace with db data)
           if(username === user.username && password === user.password) {
             authenticateUser = true;

               return done(null, user);
           }
           else {
               done(null, false, { message: 'Invalid username and password.' });
           }
       }
   ));

   // Used to store user info into session
   passport.serializeUser(function(user, done) {
     done(null, user._id);
   });

   // Used to retrieve user from session
   passport.deserializeUser(function(id, done) {
       // here the user should be queried against db using the id
       done(null, user);
   });

   module.exports = passport;
