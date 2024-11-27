
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    UserID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    FullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Location: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  return User;
};
