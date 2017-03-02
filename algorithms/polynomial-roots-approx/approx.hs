import Data.Maybe

range :: Fractional a => a
range = 10000

rootPrecision :: Fractional a => a
rootPrecision = 0.000000001

xPrecision :: Fractional a => a
xPrecision = 0.000000000001

sign :: (Ord a, Fractional a) => a -> a
sign n
    | n == 0 = 0
    | n < 0  = -1
    | n > 0  = 1

power :: (Integral a, Fractional b) => b -> a -> b
power _ 0 = 1
power n p
    | p `mod` 2 == 1 = power n (p - 1) * n
    | otherwise      = root * root
        where root = power n $ p `div` 2

derivative :: Num a => [a] -> [a]
derivative (_:xs) = map (\(c, i) -> c * fromIntegral i) coeffs
    where coeffs = zip xs [1..]

valueFor :: Fractional a => [a] -> a -> a
valueFor xs v = foldl (\sum (c, i) -> sum + c * power v i) 0 $ zip xs [0..]

binarySearch :: (Ord a, Fractional a) => a -> a -> [a] -> Maybe a
binarySearch low high xs
    | sign valueForLow * sign valueForHigh > 0 = Nothing
    | otherwise = binarySearch' low high xs
        where
            valueForLow = valueFor xs low
            valueForHigh = valueFor xs high
            increasing = valueForLow < valueForHigh

            binarySearch' :: (Ord a, Fractional a) => a -> a -> [a] -> Maybe a
            binarySearch' low high xs
                | abs (high - low) < xPrecision                                                    = Nothing
                | ((v > rootPrecision) && increasing) || ((v < -rootPrecision) && not increasing)  = binarySearch' low middle xs
                | ((v < -rootPrecision) && increasing) || ((v > rootPrecision) && not increasing)  = binarySearch' middle high xs
                | otherwise                                                                        = Just middle
                    where
                        middle = low + ((high - low) / 2)
                        v      = valueFor xs middle

approx :: (Ord a, Fractional a) => [a] -> [Maybe a]
approx [b, a] = [Just (-b / a)]
approx xs = filter (Nothing /=) $ map (\(Just low, Just high) -> binarySearch low high xs) ranges
    where
        extremumsInRange = [Just (-range)] ++ extremums ++ [Just range]
        extremums = approx $ derivative xs
        ranges = zip extremumsInRange $ drop 1 extremumsInRange

px :: Fractional a => [a]
px = [-15, -2, 1]

gx :: Fractional a => [a]
gx = [-300, -55, 18, 1]
