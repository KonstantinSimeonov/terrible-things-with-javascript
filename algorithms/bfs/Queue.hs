module Queue where
    
data Queue a = Queue {
    inputs :: [a],
    outputs :: [a]
} deriving Show

enq :: a -> Queue a -> Queue a
enq x (Queue input output) = Queue (x:input) output

enqMany :: [a] -> Queue a -> Queue a
enqMany xs (Queue input output) = Queue (reverse xs ++ input) output

deq :: Queue a -> (a, Queue a)
deq (Queue [] []) = error "Not enough elements!"
deq (Queue input (o:os)) = (o, Queue input os)
deq (Queue input []) = deq $ Queue [] (reverse input)

toQueue :: [a] -> Queue a
toQueue xs = Queue xs []