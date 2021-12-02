//Juhwan Lee
//CS320 Lab-1

#define underscore(a) _##a
#define test1(a) a*2+1
#define call_concat(m, x, y) m(x##_##y)

call_concat(underscore, u, v)
call_concat(test1, foo, bar)

#define test3(z) z % 10
#define underscore(a) _##a
#define concat_call(m, x) m##x(x)

concat_call(test, 3)
concat_call(under, score)
