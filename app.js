"use strict";

function testglMatrixJsLibrary() {
  // 벡터 연산에 사용할 두 벡터 u, v 생성
  // Sylvester 처럼 벡터의 각 원소들을 배열로 묶어서 인자로 넣어줌.
  let u = vec3.create([1, 2, 3]); // glMatrix 연산에서 목적지 인자가 있냐/없냐에 따라 첫 번째 인자(즉, srcVec)가 어떻게 변하는지 보려고 let으로 둠.
  const v = vec3.create([4, 5, 6]);

  // glMatrix 연산의 결과값을 저장할 비어있는 vec3를 추가로 생성(책에서 목적지 인자, destVec 이라고 표현됨.)
  // vec3.add 외에 다른 연산에서의 결과값도 계속 기록되도록 할거기 때문에 let으로 지정함.
  let r = vec3.create();

  // u값의 변화를 살펴본 뒤, 다른 연산에서 u값과 동일하게 사용하기 위해 따로 만들어놓은 벡터
  const t = vec3.create([1, 2, 3]);

  // 두 벡터 u, v의 합
  // 목적지 인자(r)이 전달된 연산에서는, 처음 두 개의 인자값에 아무런 변화가 없음.
  const s = vec3.add(u, v, r); // 두 벡터 u, v의 합 결과값이 비어있는 벡터 r에 기록되고, s에도 리턴이 됨. u는 변경되지 않음.
  console.log("벡터의 합(리턴받은 결과값): ", vec3.str(s));
  console.log("벡터의 합(마지막 인자에 기록된 결과값): ", vec3.str(r));
  console.log("벡터의 합(원본이 유지된 첫 번째 인자): ", vec3.str(u));

  // 목적지 인자(r)이 전달되지 않는 연산에서는, 첫 번째 인자(u)의 원본이 변경됨.
  const s2 = vec3.add(u, v); // 두 벡터 u, v의 합 결과값이 s2에 리턴되고, 첫 번째 인자 u 에도 '덮어씌워짐'
  console.log("벡터의 합(리턴받은 결과값):", vec3.str(s2));
  console.log("벡터의 합(원본이 변경된 첫 번째 인자):", vec3.str(u));

  // 두 벡터 t, v의 내적(스칼라 곱. u값의 원본이 훼손되었으므로, 요소가 동일한 t를 대신 사용할거임.)
  const d = vec3.dot(t, v);
  console.log("벡터의 내적: ", d); // 벡터의 내적은 결과값이 스칼라이므로, .str() 함수를 이용해서 문자열로 바꿔줄 필요없음.

  // 두 벡터 u, v의 외적
  const c = vec3.cross(t, v, r);
  console.log("벡터의 외적:", vec3.str(r));

  // 행렬 연산에 사용할 두 행렬 I, M 생성
  // glMatrix 에서도 WebGL-mjs 와 마찬가지로 '열 우선 행렬' 방식으로 행렬을 표기함.
  // 차이점이 있다면, glMatrix 에서는 행렬의 각 원소들을 하나의 배열로 묶어서 전달해줘야 함.
  const I = mat4.create([
    1,
    0,
    0,
    0, // 첫 번째 열(행 아님 주의!! '열 순으로' 행렬 생성)
    0,
    1,
    0,
    0, // 두 번째 열
    0,
    0,
    1,
    0, // 세 번째 열
    0,
    0,
    0,
    1, // 네 번째 열
  ]); // 4 * 4 단위 행렬을 만듦.
  const M = mat4.create([
    1,
    0,
    0,
    0, // 첫 번째 열
    0,
    1,
    0,
    0, // 두 번째 열
    0,
    0,
    1,
    0, // 세 번째 열
    2,
    3,
    4,
    1, // 네 번째 열
  ]);

  // 두 행렬 I, M의 곱셈
  const IM = mat4.create(); // 행렬 곱셈의 결과값을 기록할 목적지 인자
  mat4.multiply(I, M, IM);
  console.log("행렬의 곱셈", mat4.str(IM)); // 단위 행렬 I와 행렬 곱셈을 할 때는, MI = IM = M 이 성립함.

  // 이동 변환에 필요한 4 * 4 이동 행렬 생성. p.72 이동 행렬 예시와 구조가 동일함.
  const T = mat4.create(); // 이동 행렬 생성 후 결과값을 기록할 목적지 인자
  mat4.translate(I, [2, 3, 4], T); // 이동 행렬 생성 시 필요한 인자값들: 4 * 4 단위 행렬, 이동 거리 좌표값 배열, 목적지 인자
  console.log("이동 행렬", mat4.str(T));
}

/**
 * glMatrix 연산에서 목적지 인자 전달 여부에 따른 차이
 *
 * vec3.연산(첫 번째 인자(연산 대상1), 두 번째 인자(연산 대상2), 마지막 인자(목적지 인자))
 *
 * glMatrix에서 사용하는 연산은 기본적으로 위와 같은 구조를 갖추고 있음.
 * 이 때, 마지막 인자인 목적지 인자를 전달하느냐, 마느냐에 따라 연산 결과가 달라짐.
 *
 * 1. 목적지 인자를 전달할 경우
 * 연산 대상 1과 2의 연산 결과를 마지막 인자에 기록해준 뒤,
 * 결과값을 다른 변수에도 리턴해줄 수 있음.
 *
 * 2. 목적지 인자를 전달하지 않을 경우
 * 연산 대상 1과 2의 연산 결과가 연산 대상 1에 '덮어씌워져서' 기록되며,
 * 결과값을 다른 변수에도 리턴해 줌.
 *
 * -> 그니까 목적지 인자를 전달하지 않는다면, 첫 번째 인자로 전달한 연산 대상 1이 변경된다는 소리임.
 * 이렇게 원본 값에 의도치 않은 훼손을 줄 수 있으므로, Immutable하지 못한 연산이라고 볼 수 있음.
 *
 * 가급적 원본 값은 변경하지 않는 것이 좋으므로,
 * 마지막 인자를 생성한 뒤에 전달하는 습관을 들여야 할 것 같음..
 */

/**
 * vec3.str() / mat4.str()
 *
 * glMatrix 는 WebGL-mjs 처럼 연산의 결과값을 타입 배열로 리턴해 줌.
 *
 * 그래서 타입 배열을 문자열로 변경해서 표현하기 위해,
 * WebGL-mjs 에서는 함수를 따로 만들어서 사용해줬음.
 *
 * 그러나 glMatrix 에서는 이렇게 타입 배열로 리턴된 벡터와 행렬을 문자열로 변환해주는
 * vec3.str() / mat4.str() 함수가 내장되어 있음.
 *
 * 그래서 만약 console에 행렬과 벡터를 문자열로 찍어보고 싶다면
 * 위에 함수를 이용해 문자열로 먼저 변환하고 나서 찍어보면 됨.
 */

/**
 * glMatrix의 또 다른 특징
 *
 * glMatrix는 WebGL-mjs 처럼 모든 행렬과 벡터를 다루지 않음.
 *
 * 벡터의 경우, 3개의 원소를 가진 벡터만 지원하며(vec3 로 생성),
 * 행렬의 경우, 3 * 3 또는 4 * 4 행렬만 지원함(mat3 또는 mat4 로 생성).
 *
 * 이처럼 전반적으로 WebGL-mjs와 유사하게 WebGL에 특화되어 있는 라이브러리라고 볼 수 있음.
 */

/**
 * glMatrix 에서 이동 행렬을 만드는 방법
 *
 * WebGL-mjs 와 다르게 glMatrix 에서 이동 행렬을 만들려면 필요한 인자값이 좀 많음.
 * 구조는 아래와 같음.
 *
 * mat4.translate(4*4 단위행렬, 이동거리 좌표값, 목적지 인자)
 *
 * 첫 번째 인자는, p.71~ 아핀변환에 대한 설명을 자세히 보면 알겠지만,
 * 대부분의 변환 행렬이 4*4 단위행렬을 기반으로 만들어져 있는 것을 알 수 있음.
 * 즉, 이동 행렬의 기반이 될 4*4 단위행렬을 넘겨준 것.
 *
 * 두 번째 인자는, p.72를 보면 x, y, z 방향으로 각각 얼만큼 이동시켜 줄 것인지,
 * 그 벡터값에 변화를 줘서 이동 행렬을 만들고 있음.
 * glMatrix 에서는 그 벡터값을 배열로 묶어서 전달해 줌.
 *
 * 세 번째 인자는, 이동 행렬을 다 만들면 그거를 기록해 줄 마지막 인자로써 전달된 것임.
 * 그러니까 이동 행렬을 만들기 전에는 항상 비어있는 4*4 행렬을 미리 만들어놔야 겠지!
 */
