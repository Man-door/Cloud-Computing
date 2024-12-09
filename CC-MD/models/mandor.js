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
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PhoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    layanan_lain: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pengalaman: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    portofolio: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    rating_user: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Deskripsi: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    jangkauan: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    img: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    total_proyek: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    timestamps: false,
  });

    Mandor.associate = (models) => {
      Mandor.hasMany(models.Payment, {
        foreignKey: 'MandorID',
        as: 'Payments',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    };
    
    return Mandor;
  };
  