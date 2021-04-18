module.exports.signUpErrors = (err) => {
  let pseudo, email, password;
  pseudo = email = password = null;

  if (err.keyValue && err.keyValue.pseudo) {
    if (err.code === 11000) {
      pseudo = "Pseudo already used";
    }
    pseudo = "Pseudo incorrect";
  }
  if (err.keyValue && err.keyValue.email) {
    if (err.code === 11000) {
      email = "Email already used";
    }
    email = "Email incorrect";
  }
  if (err.password) {
    password = "Password incorrect (6 characters minimum)";
  }

  let errors = {};

  if (pseudo) {
    errors = errors ? { ...errors, pseudo } : { pseudo };
  }
  if (email) {
    errors = errors ? { ...errors, email } : { email };
  }
  if (password) {
    errors = errors ? { ...errors, password } : { password };
  }

  return errors;
};
