import { PrismaClient } from "@prisma/client";
// open restaurant.json and copy the content
import * as fs from "fs";
import * as path from "path";

const data = JSON.parse(fs.readFileSync("meals.json", "utf-8"));

const prisma = new PrismaClient();

async function main() {
  // model Meal {
  //   id           Int        @id @default(autoincrement())
  //   date         DateTime
  //   title        String
  //   food_items   String
  //   meal_type    String
  //   restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  //   restaurantId Int
  // }

  // for (const meal of data) {
  //   await prisma.meal.create({
  //     data: {
  //       date: new Date(meal.date),
  //       title: meal.title,
  //       food_items: JSON.stringify(meal.foodItems),
  //       meal_type: meal.mealType,
  //       restaurantId: meal.restaurantId
  //     }
  //   })
  // }

  // select * from Meal where restaurantId = 1;
  // prisma.meal.findMany({
  //   where: {
  //     restaurantId: 1
  //   }
  // }).then((meals) => {
  //   console.log(meals)
  // })

  // model Restaurant {
  //   id         Int      @id @default(autoincrement())
  //   name       String
  //   place      String
  //   schedule   String
  //   url        String
  //   cp         String
  //   address    String
  //   city       String
  //   phone      String
  //   img        String
  //   created_at DateTime @default(now())
  //   updated_at DateTime @updatedAt
  //   meals      Meal[]
  // }

  // for (const restaurant of data) {
  //   await prisma.restaurant.create({
  //     data: {
  //       name: restaurant.name,
  //       place: restaurant.place,
  //       schedule: restaurant.schedule,
  //       url: restaurant.url,
  //       cp: restaurant.cp,
  //       address: restaurant.address,
  //       city: restaurant.city,
  //       phone: restaurant.phone,
  //       img: restaurant.img
  //     }
  //   })
  // }


  // prisma.announcement
  //   .create({
  //     data: {
  //       title: "New Announcement",
  //       content: "This is a new announcement",
  //       img: ""
  //     },
  //   })
  //   .then((announcement) => {
  //     console.log(announcement);
  //   });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
