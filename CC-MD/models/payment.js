module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    PaymentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    SurveyID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    MandorID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    timestamps: false,
  });

  Payment.associate = (models) => {
    Payment.hasMany(models.Mandor, {
      foreignKey: 'PaymentID',
      as: 'Mandors',
    });
  };

  Payment.associate = (models) => {
    Payment.belongsTo(models.Survey, {
      foreignKey: 'SurveyID',
      as: 'SurveyDetails',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    
  };

  return Payment;
};
