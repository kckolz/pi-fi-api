#pi-fi
[Restify](http://mcavage.me/node-restify/) REST API.


##About
API for the pi-fi application

##Guide

####_Installation_
&& npm install
&& node app.js --development

```

...then open up browser to [localhost:1337/api/calendar/day](localhost:1337/api/calendar/day)

####_Structure_

pi-fi adheres to the Model-View-Controller pattern (where "Views" are simply the JSON output to be consumed by a client). Below are some example snippets of how to structure your code:

- First, define all configuration values in ```config.js``` (some defaults are provided):

```javascript
//see config.js for full example
exports.api = {
  name: 'Calendar App!',
  version: '0.0.1'
};

exports.environment = {
  name: 'development',
  port: 1337,
  //...and so on
```

- Second, add all necessary endpoints by creating a routes file in ```routes/```:

```javascript
//see routes/userRoutes.js for full example
function UserRoutes(api) {
  api.post('/api/user', userController.createUser);
  api.get('/api/user/:userId', userController.getUserById);
  //...and so on
```

- Third, add a controller in ```controllers/```:

```javascript
//see controllers/userController.js for full example
var UserController = {

  createUser: function(req, res) {

    // Create a new instance of the User model
    var user = new OAuthUsersSchema();

    // Set the client properties that came from the POST data
    var isAdmin = req.body.admin;
    user.admin = isAdmin == null || isAdmin == '' ? false : isAdmin;
    user.firstname = req.body.firstName;
    //...and so on
```

- Fourth, add a model in ```models/``` (note that one can put these in "services" as well, making models anemic data models):

```javascript
//see models/userModel.js for full example
var OAuthUsersSchema = new Schema({
  email: { type: String, unique: true, required: true },
  admin: { type: Boolean, required: true},
  hashed_password: { type: String, required: true },
  password_reset_token: { type: String, unique: true },
  reset_token_expires: Date,
  firstname: String,
  lastname: String,
  bluetooth: String,
  tracks: [Schema.Types.Mixed]
});

function hashPassword(password) {
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

OAuthUsersSchema.static('register', function(fields, cb) {
  var user;

  fields.hashed_password = hashPassword(fields.password);
  delete fields.password;

  user = new OAuthUsersModel(fields);
  return user.save();
});
  //...and so on
```

####_Testing_

```

- [Proxyquire](https://github.com/thlorenz/proxyquire) - Default dependency interceptor library.
- [Mocha](http://mochajs.org/) - Default test runner
- [Sinon](http://sinonjs.org/) - Default spies/mocks/stubs library.
- [Chai](http://chaijs.com/) - Default assertion library.

####_Promises_
[Q](https://github.com/kriskowal/q) is the default promises library.

####_Rate Limiting_
Rate limiting can be implemented via the built-in Restify throttle package. A ```HTTP 429 - Too Many Requests``` will be issued to the consumer, so adjust your web server to a notice area as needed.

- Route-based approach:

```javascript
var rateLimit = restify.throttle({
  burst: 50,
  rate: 2,
  ip: true
});

function MyRoutes(api) {
  api.get('/api/some/route', rateLimit, ...
  //..and so on
```

- Granular approach:

```javascript
function MyRoutes(api) {
  api.get('/api/some/route', restify.throttle({burst: 50,rate: 2,ip: true}), ...
  //..and so on
```

- Global approach (not recommended in most cases):

```javascript
//would be in app.js
app.use(restify.throttle({
  burst: 50,
  rate: 2,
  ip: true
});
```

####_Common Utilities_
- [Crypto](http://github.com/evanvosberg/crypto-js) - Defacto encryption library. Great for PBKDF2 password hashing.
- [Lodash](https://github.com/lodash) - Defacto functional programming library.
- [Moment](http://momentjs.com/) - Defacto date/time library.
- [Winston](https://github.com/winstonjs/winston) - Defacto logger (note wrapper library in `./libraries/logger.js`)

####_Intelligent Error Handling_
By leveraging [node domains](http://nodejs.org/api/domain.html), error handling is gracefully handled and optionally reported via the [emailjs](https://github.com/eleith/emailjs/) module (see ```config.js``` ->  ```config.environment``` to set up email logging).

##License
MIT
