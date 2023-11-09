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

const loopCharCombiner = `fn main() {
    v chars = ['e', 'l', 'l', 'i', 'e'];
    v count = 0;
    v newStr = "";
    loop chars.len() > count {
        newStr += chars[count] as string;
        count += 1;
    }
    println(newStr);
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
    v count = 2;
    v fib = 0;

    loop count <= 10 {
        fib = last + current;
        last = current;
        current = fib;
        count += 1;
    }

    println("fib(10) = " + fib);
}`;

const classExample = `class Human {
    co(name, age);
  
    v name: string;
    v age: int;
  
    fn introduce() : string {
      ret "Hello my name is " + self.name + ", I born at " + (2023 - self.age);
    }
  } 
  
  fn main() {
    v human = new Human("Ahmetcan", 22);
  
    println(human.introduce());
}`;

const speed = `fn main() {
    v now = timestamp();
    v x = 1000000;
    println("START");
  
    loop x > 0 {
      x -= 1;
    }
    v took = timestamp() - now;
    println("Operation took " + took +  "ms.");
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
    {
        name: "Loop over Char",
        title: "loopCharCombiner",
        code: loopCharCombiner,
    },
    {
        name: "Class Example",
        title: "classExample",
        code: classExample
    },
    {
        name: "Speed Test",
        title: "speedTest",
        code: speed
    }
];
