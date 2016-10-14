mergesort :: Ord a => [a] -> [a]

mergesort = head . msort . single
    where
        -- merge two sorted lists
        merge :: Ord a => [a] -> [a] -> [a]

        merge [] ys = ys
        merge xs [] = xs
        merge (x:xs) (y:ys)
                | x < y     = x:merge xs (y:ys)
                | otherwise = y:merge (x:xs) ys
        
        -- list -> list of singletons
        single :: [a] -> [[a]]

        single [] = []
        single (x:xs) = [x]:single xs

        -- merge sort a list of singletons using merge
        msort :: Ord a => [[a]] -> [[a]]

        msort [] = []
        msort [x] = [x]
        msort (x:x':xs) = msort ((merge x x'):xs)

