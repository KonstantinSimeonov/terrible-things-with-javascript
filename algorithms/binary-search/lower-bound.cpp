#include<iostream>
#include<vector>

// cyki beshe tuk i pisa kot
int main() {
    std::vector<int> numbers = {1,2,6,6,6,6,8,8,9,9,9,10};

    int left = 0, right = numbers.size();
    int x = -1;

    while(left < right) {
        int middle = (left + right) / 2;
        if(numbers[middle] < x)
            left = middle + 1;
        else right = middle;
    }

    std::cout << (left < numbers.size() && numbers[left] == x) << '\n';

}