import { Sequelize } from 'sequelize';

// 环境变量已通过默认值正常工作

// 创建 Sequelize 实例
const sequelize = new Sequelize(
  process.env.DB_NAME || 'smart_learning_platform',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root', // 临时硬编码密码用于测试
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // 禁用 SQL 查询日志
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  }
);

// 测试数据库连接
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL 数据库连接成功');

    // 在开发环境下同步数据库结构
    if (process.env.NODE_ENV === 'development') {
      // 暂时禁用自动同步，避免索引冲突
      // await sequelize.sync({ force: false });
      console.log('数据库连接成功，跳过自动同步');
    }
  } catch (error) {
    console.error('MySQL 数据库连接失败:', error.message);
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;
