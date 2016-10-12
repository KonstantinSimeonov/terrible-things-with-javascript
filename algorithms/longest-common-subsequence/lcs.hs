lcs :: Eq a => [a] -> [a] -> Int

lcs [] _ = 0
lcs _ [] = 0
lcs (x:xs) (y:ys)
        | x == y = 1 + lcs xs ys
        | otherwise = max (lcs (x:xs) ys) (lcs xs (y:ys))