import Data.List
import System.Random (randomRIO)
import qualified Data.HashSet as Kur

-- Problem 1: Last element of list
myLast :: [a] -> a
myLast [] = error "Not enough elements in the list!"
myLast [x] = x
myLast (x:xs) = myLast xs

-- Problem 2: but last element of list
myButLast :: [a] -> a
myButLast [] = error "Not enough elements in the list!"
myButLast [_] = error "Not enough elements in the list!"
myButLast [x, _] = x
myButLast (_:xs) = myButLast xs

-- Problem 3: indexing in list
elementAt :: [a] -> Int -> a
elementAt [] _ = error "Not enough elements in the list!"
elementAt (x:_) 0 = x
elementAt (_:xs) k
            | k < 0 = error "Negative index!"
            | otherwise = elementAt xs (k - 1)

-- Problem 3 with indexing operator
elementAt' :: [a] -> Int -> a
elementAt' xs k = xs !! k

-- Problem 4: list length
count :: [a] -> Int
count [] = 0
count (x:xs) = 1 + count xs

-- Problem 5: reverse
myReverse :: [a] -> [a]
myReverse [] = []
myReverse [x] = [x]
myReverse (x:xs) = myReverse xs ++ [x]

-- Problem 5: reverse with prepending instead of appending
altReverse :: [a] -> [a]
altReverse xs = reverse' xs []
    where
        reverse' [] reversed = reversed
        reverse' (x:xs) reversed = reverse' xs (x:reversed)

-- Problem 6: palinrome checking
isPalindrome :: (Eq a) => [a] -> Bool
isPalindrome xs = altReverse xs == xs

-- Problem 6: palindrome checking by doing only a half of the comparisons
palindrome :: (Eq a) => [a] -> Bool
palindrome xs = isPalindrome' [] xs xs
    where
        isPalindrome' reversed (x:xs) (_:_:ys) = isPalindrome' (x:reversed) xs ys
        isPalindrome' reversed xs [_] = reversed == xs
        isPalindrome' reversed xs [] = reversed == xs

-- Problem 7: flatten a nested data structure
data NestedList a = Element a | List [NestedList a]
flatten :: NestedList a -> [a]
flatten (Element x) = [x]
flatten (List []) = []
flatten (List (x:xs)) = flatten x ++ flatten (List xs)

tree = List [Element 1, List [Element 2, Element 3, List [Element 10, Element 18]], Element 25, List [Element 33, List [Element 68]]]

-- Problem 8: eliminate consecutive equal elements
compress' :: (Eq a) => [a] -> [a]
compress' [] = []
compress' [x] = [x]
compress' (x:x':xs) = if x == x' then compress' (x:xs) else x:(compress' (x':xs))

-- Problem 9: pack consecutive equal elements into sublists
pack :: Eq a => [a] -> [[a]]
pack [] = []
pack [x] = [[x]]
pack (x:x':xs)
        | x == x' = (\(y:ys) -> (x:y):ys) $ pack (x':xs)
        | otherwise = [x]:pack (x':xs)

-- Problem 10: encode consecutive equal elements into tuples of repeats count and the repeating elements
encode :: Eq a => [a] -> [(Int, a)]
encode = map (\list -> (count list, head list)) . pack

-- Problem 10: using list comprehension instead of map
encode' :: Eq a => [a] -> [(Int, a)]
encode' xs = [(count list, head list) | list <- pack xs]

-- Problem 11: run length encoding
data Encoding a = Single a | Multiple Int a deriving Show

encodeModified :: Eq a => [a] -> [Encoding a]
encodeModified = map tupleToEncoding . encode'
                        where
                            tupleToEncoding (1, x) = Single x
                            tupleToEncoding (n, x) = Multiple n x

-- Problem 12: decode run length encoding
decode :: Eq a => [Encoding a] -> [a]
decode [] = []
decode ((Single x):xs) = x:decode xs
decode ((Multiple n x):xs) = replicate n x ++ decode xs

-- Problem 13: direct run length encode, without using intermediate tuples
directEncode :: Eq a => [a] -> [(Int, a)]
directEncode = foldr enc []
                    where
                        enc x [] = [(1, x)]
                        enc x ((n, x'):xs)
                                | x == x' = (n + 1, x):xs
                                | otherwise = (1, x):(n, x'):xs

-- Problem 14: duplicate the elements of a list
dupe :: [a] -> [a]
dupe [] = []
dupe (x:xs) = x:x:dupe xs

-- Problem 15: replice all elements of a list k times
repl :: [a] -> Int -> [a]
repl [] _ = []
repl (x:xs) k = multi k x ++ repl xs k
            where
                multi :: Int -> a -> [a]
                multi 0 a = []
                multi k a = a:multi (k - 1) a
         
-- Problem 16: drop every K-th element from a list
dropEvery :: [a] -> Int -> [a]
dropEvery [] _ = []
dropEvery xs k = drop' xs k 1
    where
        drop' :: [a] -> Int -> Int -> [a]
        drop' [] _ _ = []
        drop' (x:xs) k i
                | i `mod` k == 0 = drop' xs k (i + 1)
                | otherwise  = x:drop' xs k (i + 1)

-- Problem 16: alternative implementation with standard library methods
dropEvery' :: [a] -> Int -> [a]
dropEvery' [] _ = []
dropEvery' xs k = (take (k - 1) xs) ++ dropEvery' (drop k xs) k

-- Problem 17: split a list into two parts - one that is k long and the rest(return a tuple)
split :: Int -> [a] -> ([a], [a])
split k xs = (take k xs, drop k xs)

-- Problem 17: split implemented without standard library
split' :: Int -> [a] -> ([a], [a])
split' k xs = split'' ([], xs) k
        where
            split'' (fst, snd) 0 = (myReverse fst, snd)
            split'' (fst, []) _ = (fst, [])
            split'' (fst, (s:snd)) k = split'' (s:fst, snd) (k - 1)

-- Problem 18: slice an array with standard library
slice :: Int -> Int -> [a] -> [a]
slice i j = take (j - i) . drop i

-- Problem 18: slice with custom implementation of drop and take
drop' :: Int -> [a] -> [a]
drop' _ [] = []
drop' 0 xs = xs
drop' k (x:xs) = drop' (k - 1) xs

take' :: Int -> [a] -> [a]
take' k xs
    | k < 0 = error "Negative index"
    | otherwise = take'' k xs
        where
            take'' _ [] = []
            take'' 0 xs = []
            take'' k (x:xs) = x:take'' (k - 1) xs

slice' :: Int -> Int -> [a] -> [a]
slice' i j = take' (j - i) . drop' i

-- Problem 19: rotate a list - take the first k elements and put them at the end of the list
-- Should work with negative indices - take the last k and put them at the front
rotate :: [a] -> Int -> [a]
rotate xs k
    | k >= 0    = (drop' k xs) ++ (take' k xs)
    | otherwise = myReverse $ rotate (myReverse xs) (-k)

-- Problem 20: Remove the K-th consecutive element
removeKth :: Int -> [a] -> (a, [a])
removeKth _ [] = error "Not enough elements!"
removeKth k xs
    | k < 0     = error "Negative index!"
    | otherwise = remove' (take (k - 1) xs) (drop (k - 1) xs)
                        where
                            remove' xs (y:ys) = (y, xs ++ ys)

-- Problem 21: Insert an element at position K
insert' :: Int -> a -> [a] -> [a]
insert' k x xs = (take' k xs) ++ x:(drop' (k + 1) xs)

-- Problem 22: range
range :: Int -> Int -> [Int]
range a b
    | (b - 1) <= a = error "Start cannot be smaller than end!"
    | otherwise = range' a b
        where
            range' a b
                | (b - 1) <= a    = [b - 1]
                | otherwise       = a:range' (a + 1) b

-- Problem 23: randomly select elements from list
rndSelect :: Int -> [a] -> IO [a]
rndSelect n xs =  do
    list <- rndList n (0, length xs)
    return $ map (\i -> xs !! i) list
    where
        rndList :: Int -> (Int, Int) -> IO [Int]
        rndList n range = sequence $ map (\_ -> randomRIO range) [1..n]