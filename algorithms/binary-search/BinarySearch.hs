binarySearch :: (Ord a) => a -> [a] -> Int
binarySearch _ [] = -1
binarySearch value list = binarySearch' value list 0 $ length list
    where 
        binarySearch' :: (Ord a) => a -> [a] -> Int -> Int -> Int
        binarySearch' value list low high
            | low >= high              = low
            | middleValue < value  = binarySearch' value list (middle + 1) high
            | otherwise            = binarySearch' value list low middle
                where
                    middleValue = list !! middle
                    middle = (high + low) `div` 2
