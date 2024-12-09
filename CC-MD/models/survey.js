module.exports = (sequelize, DataTypes) => {
  const Survey = sequelize.define('Survey', {
    SurveyID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Budget: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Deskripsi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Alamat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Tanggal: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Foto: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    FilteredMandors: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    timestamps: false,
  });

  Survey.associate = (models) => {
  Survey.hasMany(models.Payment, {
    foreignKey: 'SurveyID',
    as: 'Payments',
  });

  Survey.belongsTo(models.User, {
    foreignKey: 'UserID',
    as: 'UserDetails',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};


  return Survey;
};
