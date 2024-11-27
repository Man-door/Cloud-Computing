
module.exports = (sequelize, DataTypes) => {
    const Mandor = sequelize.define('Mandor', {
      MandorID: {
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
    Pengalaman: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Score_Pengalaman: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Score_Portofolio: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Deskripsi: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Subscribe: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    Location: {
        type: DataTypes.STRING,
        allowNull: true,
    }
    });

    Mandor.associate = (models) => {
      Mandor.hasOne(models.Data_Mandor, {
          foreignKey: 'MandorID',
          as: 'DataMandor', // Alias untuk relasi
      });
  };
  
    return Mandor;
  };
  