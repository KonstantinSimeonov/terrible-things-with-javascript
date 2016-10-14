quicksort :: Ord a => [a] -> [a]
quicksort [] = []
quicksort (x:xs) = (quicksort lesserOrEqual) ++ x:(quicksort greater)
    where
        lesserOrEqual = filter (<= x) xs
        greater       = filter (> x) xs