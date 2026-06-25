const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Category = require('../models/Category');
const Property = require('../models/Property');

dotenv.config({ path: path.join(__dirname, '../.env') });

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
    description: 'Zamonaviy turar-joy majmualaridagi yangi xonadonlar',
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

const getOrCreateAdmin = async () => {
  let admin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });

  if (!admin) {
    admin = await User.create({
      name: 'Demo Admin',
      email: 'demo-admin@example.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    });
  }

  return admin;
};

const getCategoryMap = async () => {
  const categoryMap = {};

  for (const categoryData of categoriesData) {
    let category = await Category.findOne({ name: categoryData.name });

    if (!category) {
      category = await Category.create(categoryData);
    }

    categoryMap[category.name] = category._id;
  }

  return categoryMap;
};

const buildProperties = (categoryMap, adminId) => [
  {
    title: 'Yakkasaroyda yorug‘ 3 xonali xonadon',
    description:
      'Yakkasaroy tumanida tinch mahallada joylashgan, keng va yorug‘ 3 xonali xonadon sotiladi. Xonadon yangi ta’mirlangan, oshxona mebeli va konditsioner bor. Maktab, bog‘cha va supermarket piyoda yaqin masofada.',
    price: 78000,
    currency: 'USD',
    category: categoryMap['Yangi qurilgan uylar'],
    propertyType: 'Yangi qurilgan uy',
    status: 'Aktiv',
    rooms: 3,
    floor: 7,
    totalFloors: 12,
    area: 84,
    address: 'Shota Rustaveli ko‘chasi, 61-uy',
    city: 'Toshkent',
    district: 'Yakkasaroy',
    latitude: 41.2836,
    longitude: 69.2521,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Mebel', 'Konditsioner', 'Internet', 'Oshxona mebeli', 'Domofon'],
    nearbyPlaces: ['Maktab', 'Bog‘cha', 'Supermarket', 'Park'],
    buildingYear: 2022,
    renovationStatus: 'Evroremont',
    hasBalcony: true,
    hasLift: true,
    hasParking: true,
    communications: ['Gaz', 'Svet', 'Suv', 'Kanalizatsiya', 'Internet'],
    isFeatured: true,
    isPremium: false,
    isActive: true,
    createdBy: adminId,
  },
  {
    title: 'Olmazorda metroga yaqin 2 xonali uy',
    description:
      'Metro bekatiga yaqin, arzon va shinam 2 xonali kvartira. Uy yashashga tayyor, barcha kommunikatsiyalar ulangan. Yosh oila yoki ijara biznesi uchun yaxshi variant.',
    price: 41000,
    currency: 'USD',
    category: categoryMap['Arzon uylar'],
    propertyType: 'Ko‘p qavatli dom',
    status: 'Aktiv',
    rooms: 2,
    floor: 3,
    totalFloors: 5,
    area: 48,
    address: 'Beruniy shoh ko‘chasi, 18-uy',
    city: 'Toshkent',
    district: 'Olmazor',
    latitude: 41.3446,
    longitude: 69.2168,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Internet', 'Oshxona mebeli', 'Televizor'],
    nearbyPlaces: ['Metro', 'Bozor', 'Maktab', 'Supermarket'],
    buildingYear: 1988,
    renovationStatus: 'Yaxshi',
    hasBalcony: true,
    hasLift: false,
    hasParking: true,
    communications: ['Gaz', 'Svet', 'Suv', 'Kanalizatsiya', 'Internet'],
    isFeatured: false,
    isPremium: false,
    isActive: true,
    createdBy: adminId,
  },
  {
    title: 'Sergelida yangi kompleksdan 4 xonali xonadon',
    description:
      'Sergeli tumanidagi yangi turar-joy majmuasida 4 xonali katta xonadon sotiladi. Yopiq hovli, bolalar maydonchasi, lift va parking mavjud. Xonadon katta oila uchun qulay rejalashtirilgan.',
    price: 92000,
    currency: 'USD',
    category: categoryMap['Yangi qurilgan uylar'],
    propertyType: 'Yangi qurilgan uy',
    status: 'Aktiv',
    rooms: 4,
    floor: 9,
    totalFloors: 14,
    area: 112,
    address: 'Sergeli 8-mavze, 22-uy',
    city: 'Toshkent',
    district: 'Sergeli',
    latitude: 41.2265,
    longitude: 69.2198,
    images: [
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Lift', 'Domofon', 'Yer osti parking', 'Internet'],
    nearbyPlaces: ['Maktab', 'Bog‘cha', 'Savdo markazi', 'Sport zal'],
    buildingYear: 2024,
    renovationStatus: 'Ta’mirsiz (Korobka)',
    hasBalcony: true,
    hasLift: true,
    hasParking: true,
    communications: ['Svet', 'Suv', 'Kanalizatsiya', 'Internet'],
    isFeatured: true,
    isPremium: false,
    isActive: true,
    createdBy: adminId,
  },
  {
    title: 'Chorvoq tomonda premium dala hovli',
    description:
      'Tog‘ manzarali, toza havoli hududda premium dala hovli sotiladi. Basseyn, yozgi oshxona, sauna va katta bog‘ bor. Dam olish maskani yoki oilaviy yashash uchun juda qulay.',
    price: 240000,
    currency: 'USD',
    category: categoryMap['Premium uylar'],
    propertyType: 'Villa',
    status: 'Aktiv',
    rooms: 7,
    floor: 1,
    totalFloors: 2,
    area: 360,
    landArea: 12,
    address: 'Chorvoq dam olish zonasi, 7-uy',
    city: 'Toshkent viloyati',
    district: 'Bo‘stonliq',
    latitude: 41.6249,
    longitude: 69.9406,
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Basseyn', 'Sauna', 'Garaj', 'Bog‘', 'Kamera tizimi', 'Internet'],
    nearbyPlaces: ['Dam olish maskani', 'Do‘kon', 'Park'],
    buildingYear: 2021,
    renovationStatus: 'Dizaynerlik remonti',
    hasBalcony: true,
    hasLift: false,
    hasParking: true,
    communications: ['Gaz', 'Svet', 'Suv', 'Kanalizatsiya', 'Internet'],
    isFeatured: true,
    isPremium: true,
    isActive: true,
    createdBy: adminId,
  },
  {
    title: 'Buxoroda tarixiy markazga yaqin hovli',
    description:
      'Buxoro shahrida tarixiy markazga yaqin, 5 xonali shinam hovli sotiladi. Hovlida ayvon, kichik bog‘ va avtomobil uchun joy mavjud. Oilaviy yashash yoki mehmon uyi qilish uchun mos.',
    price: 76000,
    currency: 'USD',
    category: categoryMap['Uchastkalar va Hovlilar'],
    propertyType: 'Hovli',
    status: 'Aktiv',
    rooms: 5,
    floor: 1,
    totalFloors: 1,
    area: 170,
    landArea: 5,
    address: 'Naqshband ko‘chasi, 33-uy',
    city: 'Buxoro',
    district: 'Eski shahar',
    latitude: 39.7747,
    longitude: 64.4286,
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Ayvon', 'Bog‘', 'Internet', 'Oshxona mebeli'],
    nearbyPlaces: ['Bozor', 'Masjid', 'Maktab', 'Mehmonxona'],
    buildingYear: 2015,
    renovationStatus: 'Yaxshi',
    hasBalcony: false,
    hasLift: false,
    hasParking: true,
    communications: ['Gaz', 'Svet', 'Suv', 'Kanalizatsiya', 'Internet'],
    isFeatured: false,
    isPremium: false,
    isActive: true,
    createdBy: adminId,
  },
  {
    title: 'Andijonda 6 sotixli tayyor uchastka',
    description:
      'Andijon shahriga yaqin hududda 6 sotixli, devor bilan o‘ralgan tayyor uchastka. Ichida 3 xonali yangi uy, garaj va qo‘shimcha qurilish uchun joy bor. Barcha kommunikatsiyalar mavjud.',
    price: 59000,
    currency: 'USD',
    category: categoryMap['Uchastkalar va Hovlilar'],
    propertyType: 'Uchastka',
    status: 'Aktiv',
    rooms: 3,
    floor: 1,
    totalFloors: 1,
    area: 96,
    landArea: 6,
    address: 'Bobur ko‘chasi, 104-uy',
    city: 'Andijon',
    district: 'Andijon tumani',
    latitude: 40.7834,
    longitude: 72.3442,
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Garaj', 'Ayvon', 'Internet'],
    nearbyPlaces: ['Maktab', 'Bog‘cha', 'Do‘kon', 'Masjid'],
    buildingYear: 2020,
    renovationStatus: 'Yaxshi',
    hasBalcony: false,
    hasLift: false,
    hasParking: true,
    communications: ['Gaz', 'Svet', 'Suv', 'Kanalizatsiya', 'Internet'],
    isFeatured: false,
    isPremium: false,
    isActive: true,
    createdBy: adminId,
  },
];

const addDemoProperties = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const admin = await getOrCreateAdmin();
    const categoryMap = await getCategoryMap();
    const properties = buildProperties(categoryMap, admin._id);

    let insertedCount = 0;
    let skippedCount = 0;

    for (const propertyData of properties) {
      const exists = await Property.exists({ title: propertyData.title });

      if (exists) {
        skippedCount += 1;
        continue;
      }

      await Property.create(propertyData);
      insertedCount += 1;
    }

    console.log(`Added ${insertedCount} new properties. Skipped ${skippedCount} existing properties.`);
    process.exit(0);
  } catch (error) {
    console.error(`Error adding demo properties: ${error.message}`);
    process.exit(1);
  }
};

addDemoProperties();
