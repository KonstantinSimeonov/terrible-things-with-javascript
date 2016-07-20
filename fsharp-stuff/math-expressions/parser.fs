let eval expression = 

    let rec evaluate expressionString currentIndex initialValue = 
    
        let rec number (expr:string) index value =
            if index < expr.Length && System.Char.IsDigit(expr.[index])
                then 
                number expr (index + 1) (value * 10 + (int)expr.[index] - 48)
            else if index < expr.Length && expr.[index] = '('
                then
                let (bracketsValue, newIndex) = evaluate expr (index + 1) value
                (bracketsValue, newIndex + 1)
            else
                (value, index)

        let rec product (expr:string) index value =
            let rec getRes i v = 
                if i < expr.Length then
                
                    match expr.[i] with
                        | '*' ->
                            let (subtree, newIndex) = number expr (i + 1) 0
                            getRes newIndex (v * subtree)
                        | '/' ->
                            let (subtree, newIndex) = number expr (i + 1) 0
                            getRes newIndex (v / subtree)
                        | _ -> (v, i)
                else (v, i)

            let (v, s) = number expr index 0
            getRes s v 

        let rec sum (expr:string) index value =
            let rec getRes i v = 
                if i < expr.Length then
                
                    match expr.[i] with
                        | '+' ->
                            let (subtree, newIndex) = product expr (i + 1) 1
                            getRes newIndex (v + subtree)
                        | '-' ->
                            let (subtree, newIndex) = product expr (i + 1) 1
                            getRes newIndex (v - subtree)
                        | _ -> (v, i)
                else (v, i)

            let (v, s) = product expr index value
            getRes s v 

        sum expressionString currentIndex initialValue

    let (result, index) = evaluate expression 0 0

    result

let expression = "((5+3)*4-2+4*(-1))/2+50"
let value = eval expression

printfn "%s = %i" expression value