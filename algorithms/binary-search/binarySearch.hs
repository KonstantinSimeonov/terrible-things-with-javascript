binarySearch :: (Ord a) => a -> [a] -> Int
binarySearch _ [] = -1
binarySearch value list = binarySearch' value list 0 $ length list - 1
    where 
        binarySearch' :: (Eq a, Ord a) => a -> [a] -> Int -> Int -> Int
        binarySearch' value list low high
            | low > high              = -1
            | value < list !! middle  = binarySearch' value list low (middle - 1)
            | value > list !! middle  = binarySearch' value list (middle + 1) high
            | otherwise               = middle
                where middle = low + ((high - low) `div` 2)