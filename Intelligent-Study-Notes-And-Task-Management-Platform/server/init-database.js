import { sequelize } from './src/config/database.js';
import './src/models/index.js'; // 导入所有模型

async function initDatabase() {
  try {
    console.log('开始初始化数据库...');
    
    // 测试连接
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    
    // 手动同步数据库结构
    await sequelize.sync({ 
      force: false,  // 不强制重建
      alter: false   // 不自动修改表结构
    });
    
    console.log('✅ 数据库表结构同步完成');
    
    // 检查表是否存在
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('📋 数据库表列表:');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    console.error('详细错误:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 数据库连接已关闭');
  }
}

initDatabase();
