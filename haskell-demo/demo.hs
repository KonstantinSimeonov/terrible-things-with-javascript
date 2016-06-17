data List x = Empty | x :+: List x deriving Show


map :: (a -> b) -> List a -> List b
map _ Empty = Empty
map f (x :+: xs) = f x :+: map f xs



convertFromNormal :: [a] -> List a
convertFromNormal [] = Empty
convertFromNormal (x:xs) = x :+: convertFromNormal xs


