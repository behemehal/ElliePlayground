const helloWorld = `fn main() {
  println("Hello, World!");
}`;

const loopExample = `fn main() {
    v count = 0;
    v continue = true;

    //Loop until 'count' is equal or less than 3
    loop continue {
        //If count bigger than 3
        if count > 3 {
            // Make continue false
            continue = false;
        } else {
            //Print count
            println("Count: " + count);
            //increment count by one
            count += 1;
        }
    }
}`;

const functionExample = `fn main() {

    fn collect(a: int, b: int) : int {
        ret a + b;
    }

    println("2 + 3 = " + collect(2, 3));
}`;

const fibonacciWithRecursion = `fn main() {
    fn fib(n: int) : int {
        if n <= 1 {
            ret n;
        } else {
            ret fib(n - 1) + fib(n - 2);
        }
    }

    println("fib(10) = " + fib(10));
}`;

const fibonacciWithLoop = `fn main() {
    v last = 0;
    v current = 1;
    v count = 0;
    v fib = 0;

    loop count <= 10 {
        fib = last + current;
        last = current;
        current = fib;
        count += 1;
    }

    println("fib(10) = " + fib);
}`;

export default [
  { name: "Hello World", title: "helloWorld", code: helloWorld },
  { name: "Loop Example", title: "loopExample", code: loopExample },
  { name: "Function Example", title: "functionExample", code: functionExample },
  {
    name: "Fibonacci Recursion",
    title: "fibonacciWithRecursion",
    code: fibonacciWithRecursion,
  },
  {
    name: "Fibonacci Loop",
    title: "fibonacciWithLoop",
    code: fibonacciWithLoop,
  },
];
