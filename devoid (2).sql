-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 03, 2021 at 09:23 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `devoid`
--

-- --------------------------------------------------------

--
-- Table structure for table `adress`
--

CREATE TABLE `adress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `adress` varchar(200) NOT NULL,
  `adress2` varchar(100) NOT NULL,
  `country` varchar(80) NOT NULL,
  `state` varchar(80) NOT NULL,
  `city` varchar(50) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `phone` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `adress`
--

INSERT INTO `adress` (`id`, `user_id`, `adress`, `adress2`, `country`, `state`, `city`, `postal_code`, `phone`) VALUES
(1, 1, 'asdasdasdsa', 'dasdasdas', 'Ecuador', 'Guayas', 'Guayaquil', '151252', '+1512165485');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `category_name`) VALUES
(1, 'Buzos'),
(2, 'Camisas');

-- --------------------------------------------------------

--
-- Table structure for table `collection`
--

CREATE TABLE `collection` (
  `id` int(11) NOT NULL,
  `collection_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `collection`
--

INSERT INTO `collection` (`id`, `collection_name`) VALUES
(1, 'Fantasy'),
(2, 'Moons');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total` decimal(6,2) NOT NULL,
  `order_state` int(11) NOT NULL DEFAULT 0,
  `order_date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total`, `order_state`, `order_date`) VALUES
(1, 1, '14.97', 0, '2021-10-27'),
(2, 1, '14.97', 0, '2021-10-27'),
(3, 1, '14.97', 0, '2021-10-27'),
(4, 1, '14.97', 0, '2021-10-27'),
(5, 1, '14.97', 0, '2021-10-27'),
(6, 1, '14.97', 0, '2021-10-27'),
(7, 1, '14.97', 0, '2021-10-27'),
(8, 1, '14.97', 1, '2021-10-27');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_amount` int(3) NOT NULL,
  `product_color` varchar(50) NOT NULL,
  `product_size` varchar(50) NOT NULL,
  `order_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `product_id`, `product_amount`, `product_color`, `product_size`, `order_id`) VALUES
(1, 1, 1, 'red', 'S', 1),
(2, 1, 1, 'red', 'S', 2),
(3, 1, 1, 'red', 'S', 3),
(4, 1, 1, 'red', 'S', 4),
(5, 1, 1, 'red', 'S', 5),
(6, 1, 1, 'red', 'S', 6),
(7, 1, 1, 'red', 'S', 7),
(8, 1, 1, 'red', 'S', 8);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(50) NOT NULL,
  `product_description` varchar(200) NOT NULL DEFAULT 'prenda de algodon.',
  `product_route` varchar(50) NOT NULL,
  `product_price` decimal(5,2) NOT NULL DEFAULT 0.00,
  `product_state` int(11) NOT NULL DEFAULT 1,
  `category_id` int(11) NOT NULL DEFAULT 1,
  `collection_id` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `product_name`, `product_description`, `product_route`, `product_price`, `product_state`, `category_id`, `collection_id`) VALUES
(1, 'Death', 'prenda de algodon.', 'death', '14.97', 1, 1, 1),
(2, 'Union', 'prenda de algodon.', 'union', '14.97', 1, 1, 1),
(3, 'Project', 'prenda de algodon.', 'project', '0.00', 1, 1, 1),
(5, 'Hell', 'prenda de algodon.', 'hell', '0.00', 1, 1, 1),
(6, 'Dogma', 'prenda de algodon.', 'dogma', '0.00', 1, 1, 1),
(7, 'Unknow', 'prenda de algodon.', 'unknow', '0.00', 1, 1, 1),
(8, 'Sky', 'prenda de algodon.', 'sky', '0.00', 1, 1, 1),
(9, 'Love', 'prenda de algodon.', 'love', '0.00', 1, 1, 1),
(10, 'Eyes', 'prenda de algodon.', 'eyes', '0.00', 1, 1, 1),
(11, 'Warrior', 'prenda de algodon.', 'warrior', '0.00', 1, 1, 1),
(12, 'Inmortality', 'prenda de algodon.', 'inmortality', '0.00', 1, 1, 1),
(13, 'Magic', 'prenda de algodon.', 'magic', '0.00', 1, 1, 1),
(14, 'Purify', 'prenda de algodon.', 'purify', '0.00', 1, 1, 1),
(15, 'Spirit', 'prenda de algodon.', 'spirit', '0.00', 1, 1, 1),
(16, 'Piscis', 'prenda de algodon.', 'piscis', '0.00', 1, 2, 2),
(17, 'Geminis', 'prenda de algodon.', 'geminis', '0.00', 1, 2, 2),
(18, 'Scorpio', 'prenda de algodon.', 'scorpio', '0.00', 1, 2, 2),
(19, 'Aries', 'prenda de algodon.', 'aries', '0.00', 1, 2, 2),
(20, 'Sagitario', 'prenda de algodon.', 'sagitario', '0.00', 1, 2, 2),
(21, 'Cancer', 'prenda de algodon.', 'cancer', '0.00', 1, 2, 2),
(22, 'Leo', 'prenda de algodon.', 'leo', '0.00', 1, 2, 2),
(23, 'Acuario', 'prenda de algodon.', 'Acuario', '0.00', 1, 2, 2),
(24, 'Virgo', 'prenda de algodon.', 'virgo', '0.00', 1, 2, 2),
(25, 'Capricornio', 'prenda de algodon.', 'capricornio', '0.00', 1, 2, 2),
(26, 'Libra', 'prenda de algodon.', 'libra', '0.00', 1, 2, 2),
(27, 'Tauro', 'prenda de algodon.', 'tauro', '0.00', 1, 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `product_variant`
--

CREATE TABLE `product_variant` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `color` varchar(100) NOT NULL DEFAULT '["pink","white","black","red","yellow"]',
  `size` varchar(100) NOT NULL DEFAULT '["S","M","L","XL"]'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_variant`
--

INSERT INTO `product_variant` (`id`, `product_id`, `color`, `size`) VALUES
(1, 1, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"X\"]'),
(2, 2, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(3, 3, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(4, 5, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(5, 6, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(6, 7, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(7, 8, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(8, 9, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(9, 10, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(10, 11, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(11, 12, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(12, 13, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(13, 14, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(14, 15, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(15, 16, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(16, 17, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(17, 18, '[\"pink\",\"white\",\"black\",\"red\",\"yellow\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(18, 19, '[\"white\",\"black\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(19, 20, '[\"white\",\"black\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(20, 21, '[\"white\",\"black\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(21, 22, '[\"white\",\"black\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(22, 23, '[\"white\",\"black\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(23, 24, '[\"white\",\"black\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(24, 25, '[\"white\",\"black\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(25, 26, '[\"white\",\"black\"]', '[\"S\",\"M\",\"L\",\"XL\"]'),
(26, 27, '[\"white\",\"black\"]', '[\"S\",\"M\",\"L\",\"XL\"]');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'Eythan', 'eythan@prueba.com', '$2a$10$C86SFMkYu9ht864ZaS4FGuOerFNF/awtpdVzVl4F15jNOvxbeireG');

-- --------------------------------------------------------

--
-- Table structure for table `user_car`
--

CREATE TABLE `user_car` (
  `car_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_amount` int(3) NOT NULL,
  `product_color` varchar(50) NOT NULL,
  `product_size` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adress`
--
ALTER TABLE `adress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `collection`
--
ALTER TABLE `collection`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `collection_id` (`collection_id`);

--
-- Indexes for table `product_variant`
--
ALTER TABLE `product_variant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_car`
--
ALTER TABLE `user_car`
  ADD PRIMARY KEY (`car_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adress`
--
ALTER TABLE `adress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `collection`
--
ALTER TABLE `collection`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `product_variant`
--
ALTER TABLE `product_variant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_car`
--
ALTER TABLE `user_car`
  MODIFY `car_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `adress`
--
ALTER TABLE `adress`
  ADD CONSTRAINT `adress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`collection_id`) REFERENCES `collection` (`id`);

--
-- Constraints for table `product_variant`
--
ALTER TABLE `product_variant`
  ADD CONSTRAINT `product_variant_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);

--
-- Constraints for table `user_car`
--
ALTER TABLE `user_car`
  ADD CONSTRAINT `user_car_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_car_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
