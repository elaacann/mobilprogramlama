import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clean existing data for a fresh start (Optional, but good for demo)
    await prisma.notification.deleteMany()
    await prisma.review.deleteMany()
    await prisma.favorite.deleteMany()
    await prisma.reservation.deleteMany()
    await prisma.car.deleteMany()
    await prisma.category.deleteMany()
    await prisma.office.deleteMany()
    // Not deleting users to avoid login issues

    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@rent.com' },
        update: {},
        create: {
            email: 'admin@rent.com',
            name: 'Admin User',
            password: '123',
            role: 'ADMIN',
        },
    })

    const user = await prisma.user.upsert({
        where: { email: 'user@rent.com' },
        update: {},
        create: {
            email: 'user@rent.com',
            name: 'Sample User',
            password: '123',
            role: 'USER',
        },
    })

    // Create Categories
    const catLuxury = await prisma.category.create({
        data: { name: 'Luxury', description: 'High-end premium cars', icon: 'Crown' }
    })
    const catEconomy = await prisma.category.create({
        data: { name: 'Economy', description: 'Fuel efficient and budget friendly', icon: 'Zap' }
    })
    const catSUV = await prisma.category.create({
        data: { name: 'SUV', description: 'Spacious and powerful', icon: 'Mountain' }
    })

    // Create Offices
    const office1 = await prisma.office.create({
        data: {
            name: 'Istanbul Airport',
            address: 'International Terminal, Istanbul',
            latitude: 41.2768,
            longitude: 28.7293,
        },
    })

    const office2 = await prisma.office.create({
        data: {
            name: 'Taksim Square',
            address: 'Taksim Meydani, Istanbul',
            latitude: 41.037,
            longitude: 28.985,
        },
    })

    // Create Cars
    const bmw = await prisma.car.create({
        data: {
            make: 'BMW',
            model: '320i',
            year: 2023,
            pricePerDay: 4500,
            imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80',
            officeId: office1.id,
            categoryId: catLuxury.id,
            fuelType: 'Petrol',
            transmission: 'Automatic',
            description: 'Luxury sedan with advanced features.',
        }
    })

    const merc = await prisma.car.create({
        data: {
            make: 'Mercedes',
            model: 'C200',
            year: 2024,
            pricePerDay: 5000,
            imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
            officeId: office1.id,
            categoryId: catLuxury.id,
            fuelType: 'Diesel',
            transmission: 'Automatic',
            description: 'Comfort and performance in one package.',
        }
    })

    const clio = await prisma.car.create({
        data: {
            make: 'Renault',
            model: 'Clio',
            year: 2022,
            pricePerDay: 1500,
            imageUrl: 'https://images.unsplash.com/photo-1621251912637-2598d975373a?w=800&q=80',
            officeId: office2.id,
            categoryId: catEconomy.id,
            fuelType: 'Diesel',
            transmission: 'Manual',
            description: 'Compact and economical city car.',
        }
    })

    // Create a Reservation + Review
    const res = await prisma.reservation.create({
        data: {
            userId: user.id,
            carId: bmw.id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 3), // 3 days
            totalAmount: 13500,
            status: 'COMPLETED'
        }
    })

    await prisma.review.create({
        data: {
            rating: 5,
            comment: 'Harika bir sürüş deneyimiydi, araba tertemizdi!',
            userId: user.id,
            carId: bmw.id,
            reservationId: res.id
        }
    })

    // Create a Notification for Admin
    await prisma.notification.create({
        data: {
            userId: admin.id,
            title: 'Yeni Rezervasyon',
            message: 'Yeni bir BMW 320i rezervasyonu yapıldı.',
            type: 'SUCCESS'
        }
    })

    console.log('Seed completed successfully')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
