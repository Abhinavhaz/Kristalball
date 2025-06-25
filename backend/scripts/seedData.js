const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Base = require('../models/Base');
const Asset = require('../models/Asset');
const Inventory = require('../models/Inventory');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Base.deleteMany({});
    await Asset.deleteMany({});
    await Inventory.deleteMany({});

    console.log('Cleared existing data...');

    // Create Bases
    const bases = await Base.create([
      {
        name: 'Fort Liberty',
        code: 'FL001',
        location: {
          address: '123 Military Base Rd',
          city: 'Fayetteville',
          state: 'North Carolina',
          country: 'USA'
        },
        establishedDate: new Date('1942-01-15'),
        status: 'active',
        description: 'Primary training and operations base'
      },
      {
        name: 'Camp Pendleton',
        code: 'CP002',
        location: {
          address: '456 Marine Corps Dr',
          city: 'Oceanside',
          state: 'California',
          country: 'USA'
        },
        establishedDate: new Date('1942-09-25'),
        status: 'active',
        description: 'Marine Corps training facility'
      },
      {
        name: 'Joint Base Lewis-McChord',
        code: 'JBLM003',
        location: {
          address: '789 Joint Base Blvd',
          city: 'Tacoma',
          state: 'Washington',
          country: 'USA'
        },
        establishedDate: new Date('2010-02-01'),
        status: 'active',
        description: 'Joint Army and Air Force base'
      }
    ]);

    console.log('Created bases...');

    // Create Users
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@military.gov',
        password: 'Admin123!',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        rank: 'General'
      },
      {
        username: 'commander1',
        email: 'commander1@military.gov',
        password: 'Commander123!',
        firstName: 'John',
        lastName: 'Smith',
        role: 'base_commander',
        assignedBase: bases[0]._id,
        rank: 'Colonel'
      },
      {
        username: 'commander2',
        email: 'commander2@military.gov',
        password: 'Commander123!',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'base_commander',
        assignedBase: bases[1]._id,
        rank: 'Colonel'
      },
      {
        username: 'logistics1',
        email: 'logistics1@military.gov',
        password: 'Logistics123!',
        firstName: 'Mike',
        lastName: 'Wilson',
        role: 'logistics_officer',
        assignedBase: bases[0]._id,
        rank: 'Major'
      },
      {
        username: 'logistics2',
        email: 'logistics2@military.gov',
        password: 'Logistics123!',
        firstName: 'Emily',
        lastName: 'Davis',
        role: 'logistics_officer',
        assignedBase: bases[1]._id,
        rank: 'Captain'
      }
    ]);

    console.log('Created users...');

    // Update base commanders
    await Base.findByIdAndUpdate(bases[0]._id, { commander: users[1]._id });
    await Base.findByIdAndUpdate(bases[1]._id, { commander: users[2]._id });

    // Create Assets
    const assets = await Asset.create([
      {
        name: 'M4A1 Carbine',
        type: 'weapon',
        category: 'Assault Rifle',
        model: 'M4A1',
        manufacturer: 'Colt Defense',
        specifications: {
          weight: 3.4,
          caliber: '5.56×45mm NATO'
        },
        unitOfMeasure: 'piece',
        costPerUnit: 1200,
        minimumStock: 50,
        description: 'Standard issue assault rifle'
      },
      {
        name: 'HMMWV',
        type: 'vehicle',
        category: 'Utility Vehicle',
        model: 'M1151',
        manufacturer: 'AM General',
        specifications: {
          weight: 2400,
          maxSpeed: 113,
          fuelType: 'Diesel'
        },
        unitOfMeasure: 'piece',
        costPerUnit: 220000,
        minimumStock: 5,
        description: 'High Mobility Multipurpose Wheeled Vehicle'
      },
      {
        name: '5.56mm Ammunition',
        type: 'ammunition',
        category: 'Small Arms Ammunition',
        specifications: {
          caliber: '5.56×45mm NATO'
        },
        unitOfMeasure: 'round',
        costPerUnit: 0.75,
        minimumStock: 10000,
        description: 'Standard NATO 5.56mm ammunition'
      },
      {
        name: 'Body Armor',
        type: 'equipment',
        category: 'Personal Protective Equipment',
        model: 'IOTV',
        manufacturer: 'Point Blank Enterprises',
        specifications: {
          weight: 3.3
        },
        unitOfMeasure: 'piece',
        costPerUnit: 1500,
        minimumStock: 100,
        description: 'Improved Outer Tactical Vest'
      },
      {
        name: 'MRE',
        type: 'supplies',
        category: 'Food',
        specifications: {
          weight: 0.5
        },
        unitOfMeasure: 'piece',
        costPerUnit: 8.50,
        minimumStock: 1000,
        description: 'Meal Ready to Eat'
      }
    ]);

    console.log('Created assets...');

    // Create Initial Inventory
    const inventoryData = [];
    for (const base of bases) {
      for (const asset of assets) {
        const openingBalance = Math.floor(Math.random() * 200) + 50;
        inventoryData.push({
          asset: asset._id,
          base: base._id,
          openingBalance,
          currentStock: openingBalance,
          totalPurchased: 0,
          totalTransferredIn: 0,
          totalTransferredOut: 0,
          totalAssigned: 0,
          totalExpended: 0
        });
      }
    }

    await Inventory.create(inventoryData);
    console.log('Created initial inventory...');

    console.log('✅ Seed data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin / Admin123!');
    console.log('Base Commander 1: commander1 / Commander123!');
    console.log('Base Commander 2: commander2 / Commander123!');
    console.log('Logistics Officer 1: logistics1 / Logistics123!');
    console.log('Logistics Officer 2: logistics2 / Logistics123!');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeder
const runSeeder = async () => {
  await connectDB();
  await seedData();
};

if (require.main === module) {
  runSeeder();
}

module.exports = { seedData };
