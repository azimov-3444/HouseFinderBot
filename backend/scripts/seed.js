const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Category = require('../models/Category');
const Property = require('../models/Property');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Property.deleteMany();
    console.log('Existing database collections cleared.');

    // 1. Create Admin User
    const admin = await User.create({
      name: 'Asosiy Admin',
      email: 'admin@example.com',
      password: 'admin123', // Will be hashed by userSchema pre-save hook
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    });
    console.log('Admin user created successfully (email: admin@example.com, password: admin123)');

    // 2. Create Categories
    const categoriesData = [
      {
        name: 'Arzon uylar',
        description: 'Hamyonbop va qulay sharoitlarga ega bo‘lgan uylar',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=500&q=80',
        icon: 'FaPercentage',
        isActive: true,
      },
      {
        name: 'Premium uylar',
        description: 'Haqiqiy shinamlik va hashamatni qadrlovchilar uchun uylar',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=500&q=80',
        icon: 'FaCrown',
        isActive: true,
      },
      {
        name: 'Yangi qurilgan uylar',
        description: 'Eng so‘nggi texnologiyalar asosida qurilgan zamonaviy yangi binolar',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=80',
        icon: 'FaBuilding',
        isActive: true,
      },
      {
        name: 'Uchastkalar va Hovlilar',
        description: 'Keng maydon va mustaqil shaxsiy hududga ega uylar',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=500&q=80',
        icon: 'FaHome',
        isActive: true,
      },
    ];

    const categories = await Category.create(categoriesData);
    console.log(`${categories.length} categories created successfully.`);

    // Map category name to ID
    const catMap = {};
    categories.forEach((cat) => {
      catMap[cat.name] = cat._id;
    });

    // 3. Create Properties
    const propertiesData = [
      {
        title: 'Shahar markazida shinam 2 xonali kvartira',
        description: 'Toshkent shahrining markazida joylashgan, barcha qulayliklarga ega shinam va issiq kvartira sotiladi. Uy yaqinda to‘liq ta‘mirdan chiqqan, mebellari va maishiy texnikasi yangi. Metro bekati piyoda 5 daqiqalik yo‘l. Maktab va bolalar bog‘chasi uyning yonida joylashgan. Tinch mahalla, parking joylari mavjud.',
        price: 45000,
        currency: 'USD',
        category: catMap['Arzon uylar'],
        propertyType: 'Ko‘p qavatli dom',
        status: 'Aktiv',
        rooms: 2,
        floor: 4,
        totalFloors: 9,
        area: 58,
        address: 'Amir Temur ko‘chasi, 24-uy',
        city: 'Toshkent',
        district: 'Yunusobod',
        latitude: 41.3275,
        longitude: 69.2825,
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
        ],
        videoUrl: 'https://youtube.com/watch?v=demo1',
        tourUrl: 'https://my.matterport.com/show/?m=demo1',
        amenities: ['Mebel', 'Konditsioner', 'Televizor', 'Kir yuvish mashinasi', 'Internet', 'Oshxona mebeli'],
        nearbyPlaces: ['Metro', 'Maktab', 'Bog‘cha', 'Supermarket', 'Bozor', 'Shifoxona'],
        buildingYear: 2018,
        renovationStatus: 'Evroremont',
        hasBalcony: true,
        hasLift: true,
        hasParking: true,
        communications: ['Gaz', 'Svet', 'Suv', 'Kanalizatsiya', 'Internet'],
        isFeatured: true,
        isPremium: false,
        isActive: true,
        createdBy: admin._id,
      },
      {
        title: 'Mirzo Ulug‘bek tumanida hashamatli Premium Villa',
        description: 'Nufuzli hududda joylashgan, zamonaviy hi-tech uslubida qurilgan 3 qavatli premium villa sotiladi. Katta shaxsiy basseyn, yashil hudud (bog‘), yozgi oshxona, sauna va 3 ta avtomobil uchun garaj mavjud. Uyni loyihalashtirishda eng sifatli materiallardan foydalanilgan. Aqlli uy (Smart Home) tizimi o‘rnatilgan. Xavfsizlik xizmati 24/7 ishlaydi.',
        price: 350000,
        currency: 'USD',
        category: catMap['Premium uylar'],
        propertyType: 'Villa',
        status: 'Aktiv',
        rooms: 6,
        floor: 1,
        totalFloors: 3,
        area: 450,
        landArea: 8,
        address: 'Ziyolilar ko‘chasi, 12-uy',
        city: 'Toshkent',
        district: 'Mirzo Ulug‘bek',
        latitude: 41.3328,
        longitude: 69.3415,
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        ],
        videoUrl: 'https://youtube.com/watch?v=demo2',
        tourUrl: 'https://my.matterport.com/show/?m=demo2',
        amenities: ['Aqlli uy', 'Basseyn', 'Sauna', 'Mebel', 'Konditsioner', 'Internet', 'Garaj', 'Kamera tizimi'],
        nearbyPlaces: ['Maktab', 'Bog‘cha', 'Supermarket', 'Sport zal', 'Park'],
        buildingYear: 2023,
        renovationStatus: 'Dizaynerlik remonti',
        hasBalcony: true,
        hasLift: false,
        hasParking: true,
        communications: ['Gaz', 'Svet', 'Suv', 'Kanalizatsiya', 'Internet'],
        isFeatured: true,
        isPremium: true,
        isActive: true,
        createdBy: admin._id,
      },
      {
        title: 'Yangi qurilgan binoda premium 3 xonali xonadon',
        description: 'Toshkent City yaqinidagi zamonaviy yangi turar-joy majmuasida 3 xonali premium xonadon sotiladi. Panorama oynalar orqali shahar manzarasi juda chiroyli ko‘rinadi. Uy xavfsiz yopiq hovliga ega, bolalar maydonchasi va yer osti parkingi mavjud. Kvartira qutida (korobka) holatda, o‘zingiz xohlagandek ta‘mirlab olishingiz mumkin.',
        price: 110000,
        currency: 'USD',
        category: catMap['Yangi qurilgan uylar'],
        propertyType: 'Yangi qurilgan uy',
        status: 'Aktiv',
        rooms: 3,
        floor: 12,
        totalFloors: 16,
        area: 92,
        address: 'Qoratosh ko‘chasi, 5-uy',
        city: 'Toshkent',
        district: 'Shayxontohur',
        latitude: 41.3094,
        longitude: 69.2439,
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=600&q=80',
        ],
        videoUrl: '',
        tourUrl: '',
        amenities: ['Internet', 'Domofon', 'Yer osti parking'],
        nearbyPlaces: ['Metro', 'Maktab', 'Bog‘cha', 'Supermarket', 'Savdo markazi', 'Bozor', 'Masjid'],
        buildingYear: 2025,
        renovationStatus: 'Ta‘mirsiz (Korobka)',
        hasBalcony: true,
        hasLift: true,
        hasParking: true,
        communications: ['Svet', 'Suv', 'Kanalizatsiya', 'Internet'],
        isFeatured: false,
        isPremium: true,
        isActive: true,
        createdBy: admin._id,
      },
      {
        title: 'Samarqand shahrida shinam shaxsiy Hovli',
        description: 'Samarqand shahrining tarixiy va tinch hududida shaxsiy hovli sotiladi. 6 sotixli yer maydoniga ega bo‘lib, mevali daraxtlar va yashil bog‘i bor. Hovli ichida 2 ta mashina uchun joy, yozgi ayvon bor. Uy 5 ta xonadan iborat bo‘lib, oilaviy yashash uchun ideal darajada qulay. Gaz, suv, svet uzluksiz ishlaydi.',
        price: 85000,
        currency: 'USD',
        category: catMap['Uchastkalar va Hovlilar'],
        propertyType: 'Hovli',
        status: 'Aktiv',
        rooms: 5,
        floor: 1,
        totalFloors: 1,
        area: 160,
        landArea: 6,
        address: 'Registonskaya ko‘chasi, 45-uy',
        city: 'Samarqand',
        district: 'Samarqand tumani',
        latitude: 39.6542,
        longitude: 66.9749,
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
        ],
        videoUrl: '',
        tourUrl: '',
        amenities: ['Oshxona mebeli', 'Internet', 'Konditsioner', 'Bog‘', 'Ayvon'],
        nearbyPlaces: ['Bozor', 'Masjid', 'Maktab', 'Bog‘cha', 'Park'],
        buildingYear: 2012,
        renovationStatus: 'O‘rtacha',
        hasBalcony: false,
        hasLift: false,
        hasParking: true,
        communications: ['Gaz', 'Svet', 'Suv', 'Kanalizatsiya', 'Internet'],
        isFeatured: true,
        isPremium: false,
        isActive: true,
        createdBy: admin._id,
      },
      {
        title: 'Chilonzor tumanida arzon 1 xonali uy',
        description: 'Chilonzor metrosiga yaqin joyda, shinam 1 xonali uy sotiladi. Narxi juda hamyonbop bo‘lib, talabalar yoki yosh oilalar uchun ajoyib imkoniyatdir. Uy yaxshi saqlangan, yashash uchun zarur bo‘lgan sharoitlari bor. Ijaraga berish uchun ham juda qulay joyda.',
        price: 32000,
        currency: 'USD',
        category: catMap['Arzon uylar'],
        propertyType: 'Ko‘p qavatli dom',
        status: 'Aktiv',
        rooms: 1,
        floor: 2,
        totalFloors: 4,
        area: 34,
        address: 'Chilonzor 3-kvartal, 15-uy',
        city: 'Toshkent',
        district: 'Chilonzor',
        latitude: 41.2829,
        longitude: 69.2137,
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        ],
        videoUrl: '',
        tourUrl: '',
        amenities: ['Internet', 'Televizor', 'Oshxona mebeli'],
        nearbyPlaces: ['Metro', 'Maktab', 'Supermarket', 'Bozor', 'Park'],
        buildingYear: 1978,
        renovationStatus: 'O‘rtacha',
        hasBalcony: true,
        hasLift: false,
        hasParking: false,
        communications: ['Gaz', 'Svet', 'Suv', 'Kanalizatsiya', 'Internet'],
        isFeatured: false,
        isPremium: false,
        isActive: true,
        createdBy: admin._id,
      },
      {
        title: 'Qibray tumanida shinam 4 xonali Uchastka',
        description: 'Toshkent shahriga yaqin joyda, tinch va toza havoga ega bo‘lgan Qibray tumanida 4 xonali uchastka sotiladi. 5 sotixli hududda yangi qurilgan bir qavatli uy. Devor bilan to‘liq o‘ralgan, mustahkam darvoza o‘rnatilgan. Barcha kommunikatsiya liniyalari ulangan. Oilaviy xotirjam yashash uchun eng zo‘r tanlov.',
        price: 68000,
        currency: 'USD',
        category: catMap['Uchastkalar va Hovlilar'],
        propertyType: 'Uchastka',
        status: 'Aktiv',
        rooms: 4,
        floor: 1,
        totalFloors: 1,
        area: 120,
        landArea: 5,
        address: 'Navoiy ko‘chasi, 89-uy',
        city: 'Toshkent viloyati',
        district: 'Qibray',
        latitude: 41.3854,
        longitude: 69.4589,
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
        ],
        videoUrl: '',
        tourUrl: '',
        amenities: ['Internet', 'Garaj', 'Ayvon'],
        nearbyPlaces: ['Maktab', 'Bog‘cha', 'Supermarket', 'Masjid'],
        buildingYear: 2021,
        renovationStatus: 'Yaxshi',
        hasBalcony: false,
        hasLift: false,
        hasParking: true,
        communications: ['Gaz', 'Svet', 'Suv', 'Kanalizatsiya', 'Internet'],
        isFeatured: false,
        isPremium: false,
        isActive: true,
        createdBy: admin._id,
      },
    ];

    await Property.create(propertiesData);
    console.log('Demo properties seeded successfully.');

    console.log('Database successfully seeded!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
