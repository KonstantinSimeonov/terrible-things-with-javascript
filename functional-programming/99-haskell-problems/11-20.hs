-- decode

data Encoding a = Multiple Int a | Single a

decodeModified :: [Encoding a] -> [a]

decodeModified [] = []
decodeModified ((Multiple times symbol):xs) = (take times $ repeat symbol)++(decodeModified xs)
decodeModified ((Single symbol):xs) = symbol:(decodeModified xs)

-- encode

-- encodeDirect :: [a] -> [Encoding a]