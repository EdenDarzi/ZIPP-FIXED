import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Hash password function
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data for demo in correct order
  await prisma.orderTracking.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.wallet.deleteMany({});
  await prisma.subscriptionPlan.deleteMany({});
  await prisma.courierLocation.deleteMany({});
  await prisma.courierProfile.deleteMany({});
  await prisma.courier.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('🗑️ Cleared existing data for demo setup...');

  // Create demo users for testing
  console.log('👥 Creating demo users...');
  
  const hashedPassword = await hashPassword('password');

  // לקוח דמו - כל אימייל
  const demoCustomer = await prisma.user.create({
    data: {
      fullName: 'לקוח דמו',
      email: 'customer@demo.com',
      password: hashedPassword,
      role: 'CUSTOMER',
      phone: '+972501111111',
      city: 'תל אביב',
      address: 'רחוב הדמו 1',
    }
  });

  // עסק דמו
  const demoBusiness = await prisma.user.create({
    data: {
      fullName: 'מנהל עסק דמו',
      email: 'admin@livepick.com',
      password: hashedPassword,
      role: 'RESTAURANT_OWNER',
      phone: '+972502222222',
      city: 'תל אביב',
      address: 'רחוב העסקים 10',
    }
  });

  // שליח דמו
  const demoCourier = await prisma.user.create({
    data: {
      fullName: 'שליח דמו',
      email: 'courier@livepick.com',
      password: hashedPassword,
      role: 'COURIER',
      phone: '+972503333333',
      city: 'תל אביב',
      address: 'רחוב השליחים 5',
    }
  });

  // סופר אדמין דמו
  const demoSuperAdmin = await prisma.user.create({
    data: {
      fullName: 'סופר אדמין דמו',
      email: 'superadmin@livepick.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      phone: '+972504444444',
      city: 'תל אביב',
      address: 'רחוב הניהול 20',
    }
  });

  console.log('✅ Demo users created successfully!');

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      fullName: 'מנהל המערכת',
      email: 'admin@zipp.app',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      phone: '+972501234567',
      city: 'תל אביב',
      address: 'רחוב הטכנולוגיה 1',
    }
  });

  // Create restaurant owner
  const restaurantOwner = await prisma.user.create({
    data: {
      fullName: 'משה כהן',
      email: 'owner@restaurant.com',
      password: hashedPassword,
      role: 'RESTAURANT_OWNER',
      phone: '+972502345678',
      city: 'תל אביב',
      address: 'רחוב דיזנגוף 100',
    }
  });

  // Create customer
  const customer = await prisma.user.create({
    data: {
      fullName: 'יוסי ישראלי',
      email: 'customer@example.com',
      password: hashedPassword,
      role: 'CUSTOMER',
      phone: '+972503456789',
      city: 'תל אביב',
      address: 'רחוב אלנבי 50',
    }
  });

  // Create courier user
  const courierUser = await prisma.user.create({
    data: {
      fullName: 'אחמד מחמד',
      email: 'courier@example.com',
      password: hashedPassword,
      role: 'COURIER',
      phone: '+972504567890',
      city: 'תל אביב',
      address: 'רחוב יפו 25',
    }
  });

  // Create courier profile
  const courierProfile = await prisma.courierProfile.create({
    data: {
      userId: courierUser.id,
      fullName: courierUser.fullName,
      phone: courierUser.phone!,
      email: courierUser.email,
      vehicleType: 'MOTORCYCLE',
      city: 'תל אביב',
      rating: 4.8,
      trustScore: 92.5,
      totalDeliveries: 150,
      maxCapacity: 8,
      batteryLevel: 85,
      estimatedRange: 45.0,
    }
  });

  // Add courier location
  await prisma.courierLocation.create({
    data: {
      courierId: courierProfile.id,
      lat: 32.0853,
      lng: 34.7818,
      accuracy: 5.0,
      heading: 90.0,
      speed: 25.0,
      status: 'AVAILABLE',
    }
  });

  // Create additional couriers for GPS arena
  const courierData = [
    {
      user: {
        fullName: 'דני לוי',
        email: 'danny.courier@zipp.app',
        phone: '+972505678901',
        city: 'תל אביב',
        address: 'רחוב בן יהודה 12'
      },
      profile: {
        vehicleType: 'BICYCLE' as const,
        rating: 4.6,
        trustScore: 88.2,
        totalDeliveries: 120,
        maxCapacity: 5,
        batteryLevel: 92,
        estimatedRange: 25.0
      },
      location: {
        lat: 32.0847,
        lng: 34.7728,
        heading: 45.0,
        speed: 15.0,
        status: 'AVAILABLE' as const
      }
    },
    {
      user: {
        fullName: 'שרה כהן',
        email: 'sara.courier@zipp.app',
        phone: '+972506789012',
        city: 'תל אביב',
        address: 'רחוב רוטשילד 88'
      },
      profile: {
        vehicleType: 'SCOOTER' as const,
        rating: 4.9,
        trustScore: 95.8,
        totalDeliveries: 200,
        maxCapacity: 6,
        batteryLevel: 78,
        estimatedRange: 35.0
      },
      location: {
        lat: 32.0892,
        lng: 34.7745,
        heading: 180.0,
        speed: 20.0,
        status: 'ON_DELIVERY' as const
      }
    },
    {
      user: {
        fullName: 'מיכאל רוזן',
        email: 'michael.courier@zipp.app',
        phone: '+972507890123',
        city: 'רמת גן',
        address: 'רחוב טרומפלדור 15'
      },
      profile: {
        vehicleType: 'CAR' as const,
        rating: 4.7,
        trustScore: 90.3,
        totalDeliveries: 300,
        maxCapacity: 15,
        batteryLevel: 65,
        estimatedRange: 80.0
      },
      location: {
        lat: 32.0671,
        lng: 34.8016,
        heading: 270.0,
        speed: 35.0,
        status: 'BUSY' as const
      }
    },
    {
      user: {
        fullName: 'עמר עבדאללה',
        email: 'omar.courier@zipp.app',
        phone: '+972508901234',
        city: 'יפו',
        address: 'רחוב ירושלים 45'
      },
      profile: {
        vehicleType: 'MOTORCYCLE' as const,
        rating: 4.8,
        trustScore: 93.7,
        totalDeliveries: 250,
        maxCapacity: 10,
        batteryLevel: 88,
        estimatedRange: 55.0
      },
      location: {
        lat: 32.0543,
        lng: 34.7628,
        heading: 30.0,
        speed: 28.0,
        status: 'AVAILABLE' as const
      }
    },
    {
      user: {
        fullName: 'אנה וולקוב',
        email: 'anna.courier@zipp.app',
        phone: '+972509012345',
        city: 'בת ים',
        address: 'רחוב המלאכות 8'
      },
      profile: {
        vehicleType: 'BICYCLE' as const,
        rating: 4.5,
        trustScore: 86.4,
        totalDeliveries: 95,
        maxCapacity: 7,
        batteryLevel: 91,
        estimatedRange: 40.0
      },
      location: {
        lat: 32.0189,
        lng: 34.7503,
        heading: 135.0,
        speed: 18.0,
        status: 'AVAILABLE' as const
      }
    }
  ];

  for (const courier of courierData) {
    const newCourierUser = await prisma.user.create({
      data: {
        fullName: courier.user.fullName,
        email: courier.user.email,
        password: hashedPassword,
        role: 'COURIER',
        phone: courier.user.phone,
        city: courier.user.city,
        address: courier.user.address,
      }
    });

    const newCourierProfile = await prisma.courierProfile.create({
      data: {
        userId: newCourierUser.id,
        fullName: newCourierUser.fullName,
        phone: newCourierUser.phone!,
        email: newCourierUser.email,
        vehicleType: courier.profile.vehicleType,
        city: courier.user.city,
        rating: courier.profile.rating,
        trustScore: courier.profile.trustScore,
        totalDeliveries: courier.profile.totalDeliveries,
        maxCapacity: courier.profile.maxCapacity,
        batteryLevel: courier.profile.batteryLevel,
        estimatedRange: courier.profile.estimatedRange,
      }
    });

    await prisma.courierLocation.create({
      data: {
        courierId: newCourierProfile.id,
        lat: courier.location.lat,
        lng: courier.location.lng,
        accuracy: 5.0,
        heading: courier.location.heading,
        speed: courier.location.speed,
        status: courier.location.status,
      }
    });

    // Create Courier records for API compatibility
    await prisma.courier.create({
      data: {
        fullName: newCourierUser.fullName,
        phone: newCourierUser.phone!,
        email: newCourierUser.email,
        vehicleType: courier.profile.vehicleType,
        city: courier.user.city,
      }
    });
  }

  // Also create Courier record for the original courier
  await prisma.courier.create({
    data: {
      fullName: courierUser.fullName,
      phone: courierUser.phone!,
      email: courierUser.email,
      vehicleType: 'MOTORCYCLE',
      city: courierUser.city!,
    }
  });

  // Create restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'פיצה שמש',
      description: 'הפיצה הטובה ביותר בתל אביב',
      address: 'רחוב דיזנגוף 120, תל אביב',
      city: 'תל אביב',
      phone: '+972507654321',
      email: 'info@pizzashemesh.com',
      ownerId: restaurantOwner.id,
      rating: 4.6,
      totalOrders: 523,
      location: JSON.stringify({ lat: 32.0743, lng: 34.7752 }),
      tags: JSON.stringify(['פיצה', 'איטלקי', 'מקומי']),
      deliveryFee: 8.0,
      minOrder: 30.0,
    }
  });

  // Create menu items
  const menuItems = [
    {
      name: 'פיצה מרגריטה',
      description: 'פיצה קלאסית עם רוטב עגבניות, מוצרלה טרייה ובזיליקום',
      price: 45.0,
      category: 'פיצות',
      isAvailable: true,
      isFeatured: true,
      isVegetarian: true,
      preparationTime: 15,
      calories: 320,
      ingredients: JSON.stringify(['בצק פיצה', 'רוטב עגבניות', 'מוצרלה', 'בזיליקום']),
      addons: JSON.stringify([
        {
          id: 'size',
          title: 'גודל',
          type: 'radio',
          required: true,
          options: [
            { id: 'regular', name: 'רגיל', price: 0, selectedByDefault: true },
            { id: 'large', name: 'גדול', price: 10 }
          ]
        },
        {
          id: 'toppings',
          title: 'תוספות',
          type: 'checkbox',
          required: false,
          minSelection: 0,
          maxSelection: 3,
          options: [
            { id: 'olives', name: 'זיתים', price: 3 },
            { id: 'mushrooms', name: 'פטריות', price: 4 },
            { id: 'pepperoni', name: 'פפרוני', price: 6 }
          ]
        }
      ]),
      restaurantId: restaurant.id,
    },
    {
      name: 'פיצה פפרוני',
      description: 'פיצה עם פפרוני איכותי ומוצרלה',
      price: 52.0,
      category: 'פיצות',
      isAvailable: true,
      preparationTime: 18,
      calories: 380,
      ingredients: JSON.stringify(['בצק פיצה', 'רוטב עגבניות', 'מוצרלה', 'פפרוני']),
      restaurantId: restaurant.id,
    },
    {
      name: 'סלט קיסר',
      description: 'סלט קיסר קלאסי עם קרוטונים ופרמזן',
      price: 38.0,
      category: 'סלטים',
      isAvailable: true,
      isVegetarian: true,
      preparationTime: 8,
      calories: 220,
      ingredients: JSON.stringify(['חסה', 'פרמזן', 'קרוטונים', 'רוטב קיסר']),
      restaurantId: restaurant.id,
    },
    {
      name: 'קוקה קולה',
      description: 'משקה קר ומרענן',
      price: 8.0,
      category: 'משקאות',
      isAvailable: true,
      preparationTime: 1,
      calories: 150,
      restaurantId: restaurant.id,
    }
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }

  // Create wallets
  await prisma.wallet.create({
    data: {
      userId: customer.id,
      balance: 150.0,
      currency: 'ILS',
    }
  });

  await prisma.wallet.create({
    data: {
      userId: restaurantOwner.id,
      balance: 2500.0,
      currency: 'ILS',
    }
  });

  // Create subscription plans
  const customerPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'ZIPP Customer Premium',
      type: 'CUSTOMER',
      pricingType: 'PER_ORDER',
      amount: 1.90,
      currency: 'ILS',
      features: JSON.stringify(['משלוח מהיר', 'עדיפות בתור', 'ביטול חינם']),
      benefits: JSON.stringify(['חיסכון במשלוח', 'שירות VIP']),
      description: 'חבילת לקוח פרימיום',
    }
  });

  const businessPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'ZIPP Business',
      type: 'BUSINESS',
      pricingType: 'MONTHLY_FLAT',
      amount: 2000.0,
      currency: 'ILS',
      billingCycle: 'MONTHLY',
      features: JSON.stringify(['מערכת הזמנות מתקדמת', 'ניתוח נתונים', 'תמיכה מועדפת']),
      benefits: JSON.stringify(['עמלה מופחתת', 'כלים מתקדמים']),
      description: 'חבילת עסקים מקצועית',
    }
  });

  const courierPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'ZIPP Courier Pro',
      type: 'COURIER',
      pricingType: 'MONTHLY_FLAT',
      amount: 400.0,
      currency: 'ILS',
      billingCycle: 'MONTHLY',
      features: JSON.stringify(['גישה לכל העסקים', 'כלי ניווט מתקדמים', 'ביטוח מורחב']),
      benefits: JSON.stringify(['רווחים גבוהים יותר', 'יותר הזמנות']),
      description: 'חבילת שליח מקצועית',
    }
  });

  // Create sample order
  const order = await prisma.order.create({
    data: {
      orderNumber: 'ZIPP-001',
      customerId: customer.id,
      restaurantId: restaurant.id,
      courierId: courierProfile.id,
      status: 'IN_TRANSIT',
      totalPrice: 73.90,
      subtotal: 65.0,
      deliveryFee: 8.90,
      deliveryAddress: customer.address!,
      coordinates: JSON.stringify({ lat: 32.0662, lng: 34.7748 }),
      estimatedDeliveryTime: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes from now
      trackingCode: 'TR123456',
    }
  });

  // Create order items
  const margheritaPizza = await prisma.menuItem.findFirst({
    where: { name: 'פיצה מרגריטה' }
  });

  const cocaCola = await prisma.menuItem.findFirst({
    where: { name: 'קוקה קולה' }
  });

  if (margheritaPizza && cocaCola) {
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        menuItemId: margheritaPizza.id,
        quantity: 1,
        unitPrice: margheritaPizza.price,
        totalPrice: margheritaPizza.price,
        addons: JSON.stringify([
          {
            groupId: 'size',
            groupTitle: 'גודל',
            optionId: 'large',
            optionName: 'גדול',
            optionPrice: 10
          }
        ])
      }
    });

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        menuItemId: cocaCola.id,
        quantity: 2,
        unitPrice: cocaCola.price,
        totalPrice: cocaCola.price * 2,
      }
    });
  }

  // Create order tracking
  await prisma.orderTracking.create({
    data: {
      orderId: order.id,
      status: 'CONFIRMED',
      description: 'ההזמנה אושרה ובהכנה',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    }
  });

  await prisma.orderTracking.create({
    data: {
      orderId: order.id,
      status: 'PICKED_UP',
      description: 'השליח קיבל את ההזמנה',
      location: JSON.stringify({ lat: 32.0743, lng: 34.7752 }),
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    }
  });

  await prisma.orderTracking.create({
    data: {
      orderId: order.id,
      status: 'IN_TRANSIT',
      description: 'השליח בדרך אליך',
      location: JSON.stringify({ lat: 32.0700, lng: 34.7750 }),
      estimatedTime: 10,
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Created users: ${adminUser.email}, ${restaurantOwner.email}, ${customer.email}, ${courierUser.email}`);
  console.log(`🏪 Created restaurant: ${restaurant.name}`);
  console.log(`🍕 Created ${menuItems.length} menu items`);
  console.log(`📦 Created sample order: ${order.orderNumber}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
