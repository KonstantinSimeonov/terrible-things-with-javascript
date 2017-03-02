{-# LANGUAGE BangPatterns #-}
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
power !n !p
    | p `mod` 2 == 1 = power n (p - 1) * n
    | otherwise      = root * root
        where root = power n $ p `div` 2

derivative :: Num a => [a] -> [a]
derivative (_:xs) = map (\(c, i) -> c * fromIntegral i) coeffs
    where coeffs = zip xs [1..]

valueFor :: Fractional a => [a] -> a -> a
valueFor xs !v = foldl (\sum (c, i) -> sum + c * power v i) 0 $ zip xs [0..]

binarySearch :: (Ord a, Fractional a) => a -> a -> (a -> a) -> Maybe a
binarySearch !low !high fn
    | sign valueForLow * sign valueForHigh > 0 = Nothing
    | otherwise = Just $ binarySearch' low high fn
        where
            valueForLow = fn low
            valueForHigh = fn high
            increasing = valueForLow < valueForHigh

            binarySearch' :: (Ord a, Fractional a) => a -> a -> (a -> a) -> a
            binarySearch' !low !high fn
                | abs v < rootPrecision     = middle
                | (v > 0) == increasing     = binarySearch' low middle fn
                | otherwise                 = binarySearch' middle high fn
                    where
                        middle = (high + low) / 2
                        v      = fn middle

approx :: (Ord a, Fractional a) => [a] -> [a]
approx [] = error "Not enough coefficients"
approx [_] = approx []
approx [b, a] = [-b / a]
approx xs = mapMaybe (\(low, high) -> binarySearch low high $ valueFor xs) ranges
    where
        extremumsInRange = [-range] ++ extremums ++ [range]
        extremums = approx $ derivative xs
        ranges = zip extremumsInRange $ drop 1 extremumsInRange

px :: Fractional a => [a]
px = [-15, -2, 1]

gx :: Fractional a => [a]
gx = [-300, -55, 18, 1]
