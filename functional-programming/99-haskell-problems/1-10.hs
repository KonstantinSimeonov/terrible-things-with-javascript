-- 1 - last element of list

myLast :: [a] -> a
myLast [] = error "empty list has no last element"
myLast [x] = x
myLast (_:xs) = myLast xs

-- 2 - last but one of list

myLostButt :: [a] -> a
myLostButt [x, _] = x
myLostButt (_:xs) = myLostButt xs

-- 3 - indexing

elementAt :: [a] -> Int -> a
elementAt (x:_) 1 = x
elementAt (_:xs) i = elementAt xs $ i - 1

-- 4 - length

myLength :: [a] -> Int
myLength [] = 0
myLength (_:xs) = 1 + myLength xs

myLength' :: [a] -> Int
myLength' xs = len xs 0
    where len (_:xs) current = len xs $ current + 1
          len [] l = l

-- 5 - reverse a list
myReverse :: [a] -> [a]
myReverse [] = []
myReverse (x:xs) = myReverse xs ++ [x]

myReverse' :: [a] -> [a]
myReverse' xs = rev xs []
    where
        rev [] ys = ys
        rev (x:xs) ys = rev xs $ x:ys

-- 6 - is palindrome
isPalindrome :: Eq a => [a] -> Bool
isPalindrome xs = xs == myReverse' xs

-- 7 - flatten
data NestedList a = Elem a | List [NestedList a]
flatten :: NestedList a -> [a]
flatten (Elem x) = [x]
flatten (List []) = []
flatten (List (x:xs)) = flatten x ++ flatten (List xs)
--flatten (List xs) = concat $ map flatten xs -- cuki -- QKO

-- 8 - compress
compress :: Eq a => [a] -> [a]
compress [] = []
compress [x] = [x]
compress (x:x':xs) = (if x == x' then [] else [x]) ++ compress (x':xs)
-- compress (x:x':xs)
--     | x == x'   = compress (x:xs)
--     | otherwise = x : compress (x':xs)

-- 9 - pack
pack :: Eq a => [a] -> [[a]]
pack [] = []
pack [x] = [[x]]
pack (x:x':xs)
    | x == x' = 
        let (y:ys) = pack (x':xs)
        in (x:y):ys
    | otherwise = [x]:pack (x':xs)

-- 10 - RLE
encode :: Eq a => [a] -> [(Int, a)]
encode xs = map (\ys@(y:_) -> (myLength' ys, y)) $ pack xs