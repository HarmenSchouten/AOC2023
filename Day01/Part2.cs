using System;
using System.IO;

var text = await File.ReadAllTextAsync("Day01/input.txt");

var lookup = new Dictionary<string, int>() {
    { "one", 1 },
    { "two", 2 },
    { "three", 3 },
    { "four", 4 },
    { "five", 5},
    { "six", 6 },
    { "seven", 7 },
    { "eight", 8 },
    { "nine", 9 }
};

var answer = text
    .Split("\r\n")
    .Aggregate(0, (acc, state) => {
        var numbers = new List<int>();
        for (var i = 0; i < state.Length; i++) {
            if (int.TryParse($"{state[i]}", out var number)) {
                numbers.Add(number);
            }

            foreach (var (key, value) in lookup) {
                if (state.Substring(i).StartsWith(key)) {
                    numbers.Add(value);
                }
            }
        }

        return acc + numbers.First() * 10 + numbers.Last();
    });

Console.WriteLine(answer);  