PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO _prisma_migrations VALUES('c9ee5d8a-cf4f-46a4-b4c0-3d431fd1eb0c','7af65c681f5a524c56c90d86e2af61971abbaa88724ced469dd5d94fef93b996',1750593447906,'20250619140228_init',NULL,NULL,1750593447873,1);
INSERT INTO _prisma_migrations VALUES('102d1ecd-d301-4e03-88ff-4c136236fae4','3059776fd424535e0d938313078cc13caf1674d846a39eb5e4111b5283541aa4',1750593447934,'20250619213907_add_featured_to_products',NULL,NULL,1750593447910,1);
INSERT INTO _prisma_migrations VALUES('41038583-ea85-4ca7-a221-7262f0d49238','c353850601fb12c1c403c413f3ab88bb8ae07a609ca33064e781f835257c3531',1750593447968,'20250622090254_add_address_to_user',NULL,NULL,1750593447938,1);
INSERT INTO _prisma_migrations VALUES('4d2fab9b-5827-4f8a-8f9a-1977dc618e5c','3ffbdd6582ac02e25956588ef7085bbfe1c1a710950264ea141911628e22d19f',1750593448010,'20250622095455_add_address_model',NULL,NULL,1750593447973,1);
INSERT INTO _prisma_migrations VALUES('bb64281f-9364-4763-848f-6444e8b5b0a6','594ba38ad0d410a9099a92239fc66a9cc0f473cde44943e2e9a790f8f8c733f4',1750593448041,'20250622112257_update_product_model_for_shoes',NULL,NULL,1750593448014,1);
INSERT INTO _prisma_migrations VALUES('19c31941-a16b-4ed1-b209-e7470bc91adf','429a531647e1c022e0751090f1d6875a040d43c1cbe49507f2261a57e59731b4',1750593448069,'20250622112414_ayakkabi',NULL,NULL,1750593448045,1);
INSERT INTO _prisma_migrations VALUES('75c3345c-6b8b-400c-a4a2-4133dd0d8b14','85b712a9a20d8464e6047de67a9f153342d28607f3c7b5f5f9df10974952e027',1750593448099,'20250622115631_add_order_address_relation',NULL,NULL,1750593448074,1);
INSERT INTO _prisma_migrations VALUES('eebf896b-99df-4d13-be18-76dec271098c','605911253469c318286c154997b24311eae2db988bb71289e2f04694ae6e35aa',1750596769857,'20250622125249_add_color_size_to_order_items',NULL,NULL,1750596769823,1);
INSERT INTO _prisma_migrations VALUES('f3aa1295-8bbc-4c41-8c35-618dbd1559d4','6197523bcc73f55e0ad663e58608f5f8e1368ee245c5c32df186a5d2760990dc',1751458145234,'20250702120905_add_wishlist_comment_returnrequest',NULL,NULL,1751458145210,1);
INSERT INTO _prisma_migrations VALUES('a31c4e3c-876c-4de5-b69e-9696c04c71a7','fec258c5323a5b48dc1b75ea6f57d01f4c5a4e324f2da66b3e1752c3df31afd5',1751472942164,'20250702161542_add_cascade_to_relations',NULL,NULL,1751472942022,1);
INSERT INTO _prisma_migrations VALUES('b8b53563-3bd0-44c3-bdda-85df73b4b469','9a741439144a4a832c250c2a269c1083495981cb9f7f74ff82b3b8a5741a8b3f',1751529746168,'20250703080226_address_setnull',NULL,NULL,1751529746134,1);
CREATE TABLE IF NOT EXISTS "Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientSurname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Address VALUES(7,7,'a','a','aa','a','ADANA','ALADAĞ','AKÖREN MAH','a',0,1751529809834,1751529809834);
CREATE TABLE IF NOT EXISTS "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO User VALUES(7,'asdAdmin','User','a@a','$2b$10$aok39Y3Gxnf..Xi4pQPqkeMUnnY4UTIPfq.wD67UYmSyXnHtZL7C2','ADMIN',1751473301785,1751545881218);
INSERT INTO User VALUES(8,'Normal','User','b@b','$2b$10$2XOnotBB/yuQDfeqwxLps.1fV12ROZZ49kdm69OItil1RZv4e.byK','USER',1751473302049,1751473302049);
CREATE TABLE IF NOT EXISTS "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "stock" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "colors" TEXT NOT NULL,
    "sizes" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Product VALUES(453,'Nike React Infinity Run Flyknit','Nike React Infinity Run Flyknit',4200.0,3,'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-665455a5-45de-40fb-945f-c1852b82400d/react-infinity-run-flyknit-mens-running-shoe-zX42Nc.jpg','Nike','Spor','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-665455a5-45de-40fb-945f-c1852b82400d/react-infinity-run-flyknit-mens-running-shoe-zX42Nc.jpg"]',1,1751531476386,1751538450923);
INSERT INTO Product VALUES(454,'Nike React Miler','Nike React Miler',1300.0,3,'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-5cc7de3b-2afc-49c2-a1e4-0508997d09e6/react-miler-mens-running-shoe-DgF6nr.jpg','Nike','Koşu','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-5cc7de3b-2afc-49c2-a1e4-0508997d09e6/react-miler-mens-running-shoe-DgF6nr.jpg"]',1,1751531476398,1751540642554);
INSERT INTO Product VALUES(455,'Nike Air Zoom Pegasus 37','Nike Air Zoom Pegasus 37',1200.0,3,'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-33b0a0a5-c171-46cc-ad20-04a768703e47/air-zoom-pegasus-37-womens-running-shoe-Jl0bDf.jpg','Nike','Koşu','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-33b0a0a5-c171-46cc-ad20-04a768703e47/air-zoom-pegasus-37-womens-running-shoe-Jl0bDf.jpg"]',0,1751531476404,1751540642554);
INSERT INTO Product VALUES(456,'Nike Joyride Run Flyknit','Nike Joyride Run Flyknit',1800.0,3,'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/99a7d3cb-e40c-4474-91c2-0f2e6d231fd2/joyride-run-flyknit-womens-running-shoe-HcfnJd.jpg','Nike','Koşu','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/99a7d3cb-e40c-4474-91c2-0f2e6d231fd2/joyride-run-flyknit-womens-running-shoe-HcfnJd.jpg"]',0,1751531476412,1751540642554);
INSERT INTO Product VALUES(457,'Nike Mercurial Vapor 13 Elite FG','Nike Mercurial Vapor 13 Elite FG',2500.0,3,'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/9dda6202-e2ff-4711-9a09-0fcb7d90c164/mercurial-vapor-13-elite-fg-firm-ground-soccer-cleat-14MsF2.jpg','Nike','Futbol','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/9dda6202-e2ff-4711-9a09-0fcb7d90c164/mercurial-vapor-13-elite-fg-firm-ground-soccer-cleat-14MsF2.jpg"]',0,1751531476420,1751540642554);
INSERT INTO Product VALUES(458,'Nike Phantom Vision Elite Dynamic Fit FG','Nike Phantom Vision Elite Dynamic Fit FG',1500.0,3,'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/s1amp7uosrn0nqpsxeue/phantom-vision-elite-dynamic-fit-fg-firm-ground-soccer-cleat-19Kv1V.jpg','Nike','Futbol','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/s1amp7uosrn0nqpsxeue/phantom-vision-elite-dynamic-fit-fg-firm-ground-soccer-cleat-19Kv1V.jpg"]',0,1751531476428,1751540642554);
INSERT INTO Product VALUES(459,'Nike Phantom Venom Academy FG','Nike Phantom Venom Academy FG',800.0,3,'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/whegph8z9ornhxklc8rp/phantom-venom-academy-fg-firm-ground-soccer-cleat-6JVNll.jpg','Nike','Futbol','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/whegph8z9ornhxklc8rp/phantom-venom-academy-fg-firm-ground-soccer-cleat-6JVNll.jpg"]',0,1751531476437,1751540642554);
INSERT INTO Product VALUES(460,'Nike Mercurial Vapor 13 Elite Tech Craft FG','Nike Mercurial Vapor 13 Elite Tech Craft FG',1450.0,3,'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/vhbwnkor8sxt8qtecgia/mercurial-vapor-13-elite-tech-craft-fg-firm-ground-soccer-cleat-l38JPj.jpg','Nike','Futbol','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/vhbwnkor8sxt8qtecgia/mercurial-vapor-13-elite-tech-craft-fg-firm-ground-soccer-cleat-l38JPj.jpg"]',0,1751531476445,1751540642554);
INSERT INTO Product VALUES(461,'Nike Mercurial Superfly 7 Pro MDS FG','Nike Mercurial Superfly 7 Pro MDS FG',1370.0,3,'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-a52a8aec-22dc-4982-961b-75c5f4c72805/mercurial-superfly-7-pro-mds-fg-firm-ground-soccer-cleat-mhcpdN.jpg','Nike','Futbol','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-a52a8aec-22dc-4982-961b-75c5f4c72805/mercurial-superfly-7-pro-mds-fg-firm-ground-soccer-cleat-mhcpdN.jpg"]',0,1751531476454,1751540642554);
INSERT INTO Product VALUES(462,'Nike Air Force 1','Nike Air Force 1',1400.0,3,'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/178b2a46-3ee4-492b-882e-f71efdd53a36/air-force-1-big-kids-shoe-2zqp8D.jpg','Nike','Günlük','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/178b2a46-3ee4-492b-882e-f71efdd53a36/air-force-1-big-kids-shoe-2zqp8D.jpg"]',0,1751531476462,1751540642554);
INSERT INTO Product VALUES(463,'Nike Air Max 90','Nike Air Max 90',1000.0,3,'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8439f823-86cf-4086-81d2-4f9ff9a66866/air-max-90-big-kids-shoe-1wzwJM.jpg','Nike','Günlük','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8439f823-86cf-4086-81d2-4f9ff9a66866/air-max-90-big-kids-shoe-1wzwJM.jpg"]',0,1751531476470,1751540642554);
INSERT INTO Product VALUES(464,'Nike Air Max 90 LTR','Nike Air Max 90 LTR',1100.0,3,'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-620aeb37-1b28-44b0-9b14-5572f8cbc948/air-max-90-ltr-big-kids-shoe-hdNLQ5.jpg','Nike','Günlük','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-620aeb37-1b28-44b0-9b14-5572f8cbc948/air-max-90-ltr-big-kids-shoe-hdNLQ5.jpg"]',0,1751531476479,1751540642554);
INSERT INTO Product VALUES(465,'Nike Joyride Dual Run','Nike Joyride Dual Run',1100.0,3,'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/33888130-0320-41a1-ba53-a026decd8aa2/joyride-dual-run-big-kids-running-shoe-1HDJF8.jpg','Nike','Koşu','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/33888130-0320-41a1-ba53-a026decd8aa2/joyride-dual-run-big-kids-running-shoe-1HDJF8.jpg"]',0,1751531476487,1751540642554);
INSERT INTO Product VALUES(466,'Nike Renew Run','Nike Renew Run',800.0,3,'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-73e54c0b-11a6-478b-9f90-bd97fcde872d/renew-run-big-kids-running-shoe-5Bpz93.jpg','Nike','Koşu','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-73e54c0b-11a6-478b-9f90-bd97fcde872d/renew-run-big-kids-running-shoe-5Bpz93.jpg"]',0,1751531476496,1751540642554);
INSERT INTO Product VALUES(477,'Nizza X Disney','Nizza X Disney',550.0,6,'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/ef901c7aeac042578eceab9d0159196c_9366/Nizza_x_Disney_Sport_Goofy_Shoes_White_FW0651_01_standard.jpg','Adidas','Günlük','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/ef901c7aeac042578eceab9d0159196c_9366/Nizza_x_Disney_Sport_Goofy_Shoes_White_FW0651_01_standard.jpg"]',0,1751531476585,1751540642554);
INSERT INTO Product VALUES(478,'X_PLR','X_PLR',650.0,5,'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/a36518227134495da766ab9d01772fa2_9366/X_PLR_Shoes_Red_FY9063_01_standard.jpg','Adidas','Günlük','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/a36518227134495da766ab9d01772fa2_9366/X_PLR_Shoes_Red_FY9063_01_standard.jpg"]',1,1751531476594,1751540642554);
INSERT INTO Product VALUES(479,'Stan Smith','Stan Smith',550.0,3,'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/d0720712d81e42b1b30fa80800826447_9366/Stan_Smith_Shoes_White_M20607_M20607_01_standard.jpg','Adidas','Günlük','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/d0720712d81e42b1b30fa80800826447_9366/Stan_Smith_Shoes_White_M20607_M20607_01_standard.jpg"]',0,1751531476603,1751540642554);
INSERT INTO Product VALUES(480,'NMD_R1','NMD_R1',1200.0,3,'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/99ca762cb9054caf82fbabc500fd146e_9366/NMD_R1_Shoes_Blue_FY9392_01_standard.jpg','Adidas','Koşu','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/99ca762cb9054caf82fbabc500fd146e_9366/NMD_R1_Shoes_Blue_FY9392_01_standard.jpg"]',0,1751531476611,1751540642554);
INSERT INTO Product VALUES(481,'NMD_R1 Flash Red','NMD_R1 Flash Red',1400.0,5,'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/90f85768e3894aeaab67aba0014a3379_9366/NMD_R1_Shoes_Red_FY9389_01_standard.jpg','Adidas','Günlük','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/90f85768e3894aeaab67aba0014a3379_9366/NMD_R1_Shoes_Red_FY9389_01_standard.jpg"]',0,1751531476618,1751540642554);
INSERT INTO Product VALUES(482,'Superstar','Superstar',900.0,3,'https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/12365dbc7c424288b7cdab4900dc7099_9366/Superstar_Shoes_White_FW3553_FW3553_01_standard.jpg','Adidas','Günlük','["Beyaz","Siyah","Kırmızı"]','[37,38,39,40,41,42,43,44,45]','["https://assets.adidas.com/images/h_320,f_auto,q_auto:sensitive,fl_lossy/12365dbc7c424288b7cdab4900dc7099_9366/Superstar_Shoes_White_FW3553_FW3553_01_standard.jpg"]',0,1751531476625,1751540642554);
CREATE TABLE IF NOT EXISTS "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "color" TEXT,
    "size" TEXT,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO OrderItem VALUES(6,6,478,1,650.0,'Kırmızı','42');
INSERT INTO OrderItem VALUES(7,7,453,1,4200.0,'Kırmızı','42');
CREATE TABLE IF NOT EXISTS "ReturnRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Beklemede',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReturnRequest_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReturnRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO ReturnRequest VALUES(2,5,7,'evet','İptal Talebi',1751526132065);
INSERT INTO ReturnRequest VALUES(3,7,7,'param yok','İptal Talebi',1751539990408);
INSERT INTO ReturnRequest VALUES(4,7,7,'param yok','İptal Talebi',1751540076397);
INSERT INTO ReturnRequest VALUES(5,7,7,'zc','İptal Talebi',1751540231226);
INSERT INTO ReturnRequest VALUES(6,7,7,'as','İptal Talebi',1751540317748);
CREATE TABLE IF NOT EXISTS "Wishlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Wishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Beklemede',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "addressId" INTEGER,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "Order" VALUES(5,7,'İptal Edildi',1751526119738,1751540848570,NULL);
INSERT INTO "Order" VALUES(6,7,'Gönderildi',1751539254477,1751539596642,7);
INSERT INTO "Order" VALUES(7,7,'İptal Edildi',1751539937874,1751540851613,7);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('User',9);
INSERT INTO sqlite_sequence VALUES('Product',485);
INSERT INTO sqlite_sequence VALUES('Address',7);
INSERT INTO sqlite_sequence VALUES('Comment',1);
INSERT INTO sqlite_sequence VALUES('Message',2);
INSERT INTO sqlite_sequence VALUES('OrderItem',7);
INSERT INTO sqlite_sequence VALUES('ReturnRequest',6);
INSERT INTO sqlite_sequence VALUES('Wishlist',3);
INSERT INTO sqlite_sequence VALUES('Order',7);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Wishlist_userId_productId_key" ON "Wishlist"("userId", "productId");
COMMIT;
