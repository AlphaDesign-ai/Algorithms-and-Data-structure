'use strict';
import { StackArray as StackLs } from '../../data_structure/stack/index';

//conversion infix to postfix expression
const operatorTable = {
  '+': { $prec: 1, $ass: { $ltr: true, $rtl: false } },
  '-': { $prec: 1, $ass: { $ltr: true, $rtl: false } },
  '*': { $prec: 2, $ass: { $ltr: true, $rtl: false } },
  '/': { $prec: 2, $ass: { $ltr: true, $rtl: false } },
  '^': { $prec: 3, $ass: { $ltr: false, $rtl: true } },
};

function checkStack(stack, exp) {
  const obj = { poppedOp: [] };

  void (function me() {
    if (stack.isEmpty) {
      stack.push(exp.value);
    } else if (/[\(\)]/.test(exp.value)) {
      if (
        (exp.value.charCodeAt(0) === 40 && exp.postfix) ||
        (exp.value.charCodeAt(0) === 41 && exp.prefix)
      ) {
        stack.push(exp.value);
      } else if (
        (exp.value.charCodeAt(0) === 41 && exp.postfix) ||
        (exp.value.charCodeAt(0) === 40 && exp.prefix)
      ) {
        while (!['(', ')'].includes(stack.peek)) {
          obj.poppedOp.push(stack.pop());
        }
        stack.pop();
      }
    } else if (['(', ')'].includes(stack.peek)) {
      stack.push(exp.value);
    } else if (
      operatorTable[stack.peek].$prec >= operatorTable[exp.value].$prec
    ) {
      //check operator precedence
      if (
        operatorTable[stack.peek].$prec > operatorTable[exp.value].$prec ||
        (operatorTable[exp.value].$ass.$ltr && exp.postfix)
      ) {
        obj.poppedOp.push(stack.pop()), me();
      } else if (operatorTable[exp.value].$ass.$rtl || exp.prefix) {
        stack.push(exp.value);
      }
    } else if (
      operatorTable[stack.peek].$prec < operatorTable[exp.value].$prec
    ) {
      stack.push(exp.value);
    }
  })();

  return obj;
}

export function convertExp(expression, type) {
  // debugger;
  if (!['postfix', 'prefix'].includes(type)) {
    throw handleNode(
      "Sorry the type you entered isn't allow.Type allow is postfix, infix"
    );
  }

  // debugger;
  const postFix = [];
  Object.defineProperty(postFix, 'this', {
    value: function (limiter) {
      return this.reverse().join(limiter);
    },
    enumerable: false,
  });

  const isPrefix = type === 'prefix';
  let counter = isPrefix ? expression.length - 1 : 0;
  const opStack = new StackLs(Math.ceil(expression.length / 3)); //operator stack

  void (function me() {
    if (expression[counter] === undefined) {
      while (!opStack.isEmpty) {
        postFix.push(opStack.pop());
      }
      return;
    }

    if (!['+', '-', '*', '/', '^', '(', ')'].includes(expression[counter])) {
      //exclude operator from selection
      postFix.push(expression[!isPrefix ? counter++ : counter--]);
    } else {
      //pop item from the stack until a close `)`
      const value = checkStack(opStack, {
        value: expression[!isPrefix ? counter++ : counter--],
        [type]: true,
      });

      if (value.poppedOp.length) {
        postFix.push(...value.poppedOp);
      }
    }

    return me(); //recur call
  })();
  return postFix[isPrefix ? 'this' : 'join']('');
}

export function parseIF(expression) {
  const operandStk = new StackLs(expression.length);
  let counter = expression.length - 1;
  return (function parse() {
    if (!expression[counter]) {
      return operandStk.pop();
    }

    if (+expression[counter]) {
      operandStk.push(expression[counter--]);
    } else {
      const op2 = operandStk.pop();
      const op1 = operandStk.pop();
      operandStk.push(
        eval(
          `${op2}${
            /\^/.test(expression[counter]) ? '**' : expression[counter]
          }${op1}`
        )
      );
      counter--;
    }
    return parse();
  })();
}

export function parsePF(expression) {
  const operandStk = new StackLs(expression.length);
  let counter = 0;
  return (function parse() {
    if (!expression[counter]) {
      return operandStk.pop();
    }

    if (+expression[counter]) {
      operandStk.push(expression[counter++]);
    } else {
      const op2 = operandStk.pop();
      const op1 = operandStk.pop();
      operandStk.push(
        eval(
          `${op1}${
            /\^/.test(expression[counter]) ? '**' : expression[counter]
          }${op2}`
        )
      );
      counter++;
    }
    return parse();
  })();
}

export function pftinfix(exp) {
  const operandStk = new StackLs(Math.ceil(exp.length / 2));
  let counter = 0;

  return (function parse() {
    if (!exp[counter]) {
      return operandStk.pop();
    }

    if (+exp[counter] || !operatorTable[exp[counter]]) {
      operandStk.push(exp[counter++]);
    } else {
      const op2 = operandStk.pop();
      const op1 = operandStk.pop();
      operandStk.push(`(${op1}${exp[counter]}${op2})`);
      counter++;
    }
    return parse();
  })();
}

export function prftinfix(exp) {
  const operandStk = new StackLs(Math.ceil(exp.length / 2));
  let counter = exp.length - 1;
  // debugger;
  return (function parse() {
    if (counter < 0) {
      return operandStk.pop();
    }

    if (+exp[counter] || !operatorTable[exp[counter]]) {
      operandStk.push(exp[counter--]);
    } else {
      const op1 = operandStk.pop();
      const op2 = operandStk.pop();
      operandStk.push(`(${op1}${exp[counter]}${op2})`);
      counter--;
    }
    return parse();
  })();
}
