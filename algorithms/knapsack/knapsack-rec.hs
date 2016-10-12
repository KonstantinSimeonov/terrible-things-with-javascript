knapsack :: Int -> [(Int, Int)] -> Int

knapsack _ [] = 0
knapsack 0 _ = 0
knapsack canCarry ((w, v):wv)
        | canCarry < w = knapsack canCarry wv
        | otherwise          = max (v + knapsack (canCarry - w) wv) (knapsack canCarry wv)