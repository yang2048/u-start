function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;t.length>n;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function n(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}function r(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;o.length>r;r++)0>t.indexOf(n=o[r])&&(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;o.length>r;r++)0>t.indexOf(n=o[r])&&Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function i(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);t>n;n++)r[n]=e[n];return r}function o(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return i(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,o=function(){};return{s:o,n:function(){return e.length>r?{done:!1,value:e[r++]}:{done:!0}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,s=!0,u=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return s=e.done,e},e:function(e){u=!0,a=e},f:function(){try{s||null==n.return||n.return()}finally{if(u)throw a}}}}
/**
 * @license QR Code generator library (TypeScript)
 * Copyright (c) Project Nayuki.
 * SPDX-License-Identifier: MIT
 */var a;!function(t){var r=function(){function r(t,n,i,o){if(e(this,r),this.version=void 0,this.errorCorrectionLevel=void 0,this.size=void 0,this.mask=void 0,this.modules=[],this.isFunction=[],this.version=t,this.errorCorrectionLevel=n,r.MIN_VERSION>t||t>r.MAX_VERSION)throw new RangeError("Version value out of range");if(-1>o||o>7)throw new RangeError("Mask value out of range");this.size=4*t+17;for(var a=[],u=0;this.size>u;u++)a.push(!1);for(var l=0;this.size>l;l++)this.modules.push(a.slice()),this.isFunction.push(a.slice());this.drawFunctionPatterns();var h=this.addEccAndInterleave(i);if(this.drawCodewords(h),-1==o)for(var c=1e9,f=0;8>f;f++){this.applyMask(f),this.drawFormatBits(f);var v=this.getPenaltyScore();c>v&&(o=f,c=v),this.applyMask(f)}s(o>=0&&7>=o),this.mask=o,this.applyMask(o),this.drawFormatBits(o),this.isFunction=[]}return n(r,[{key:"getModule",value:function(e,t){return e>=0&&this.size>e&&t>=0&&this.size>t&&this.modules[t][e]}},{key:"getModules",value:function(){return this.modules}},{key:"drawFunctionPatterns",value:function(){for(var e=0;this.size>e;e++)this.setFunctionModule(6,e,e%2==0),this.setFunctionModule(e,6,e%2==0);this.drawFinderPattern(3,3),this.drawFinderPattern(this.size-4,3),this.drawFinderPattern(3,this.size-4);for(var t=this.getAlignmentPatternPositions(),n=t.length,r=0;n>r;r++)for(var i=0;n>i;i++)0==r&&0==i||0==r&&i==n-1||r==n-1&&0==i||this.drawAlignmentPattern(t[r],t[i]);this.drawFormatBits(0),this.drawVersion()}},{key:"drawFormatBits",value:function(e){for(var t=this.errorCorrectionLevel.formatBits<<3|e,n=t,r=0;10>r;r++)n=n<<1^1335*(n>>>9);var i=21522^(t<<10|n);s(i>>>15==0);for(var o=0;5>=o;o++)this.setFunctionModule(8,o,a(i,o));this.setFunctionModule(8,7,a(i,6)),this.setFunctionModule(8,8,a(i,7)),this.setFunctionModule(7,8,a(i,8));for(var u=9;15>u;u++)this.setFunctionModule(14-u,8,a(i,u));for(var l=0;8>l;l++)this.setFunctionModule(this.size-1-l,8,a(i,l));for(var h=8;15>h;h++)this.setFunctionModule(8,this.size-15+h,a(i,h));this.setFunctionModule(8,this.size-8,!0)}},{key:"drawVersion",value:function(){if(this.version>=7){for(var e=this.version,t=0;12>t;t++)e=e<<1^7973*(e>>>11);var n=this.version<<12|e;s(n>>>18==0);for(var r=0;18>r;r++){var i=a(n,r),o=this.size-11+r%3,u=Math.floor(r/3);this.setFunctionModule(o,u,i),this.setFunctionModule(u,o,i)}}}},{key:"drawFinderPattern",value:function(e,t){for(var n=-4;4>=n;n++)for(var r=-4;4>=r;r++){var i=Math.max(Math.abs(r),Math.abs(n)),o=e+r,a=t+n;o>=0&&this.size>o&&a>=0&&this.size>a&&this.setFunctionModule(o,a,2!=i&&4!=i)}}},{key:"drawAlignmentPattern",value:function(e,t){for(var n=-2;2>=n;n++)for(var r=-2;2>=r;r++)this.setFunctionModule(e+r,t+n,1!=Math.max(Math.abs(r),Math.abs(n)))}},{key:"setFunctionModule",value:function(e,t,n){this.modules[t][e]=n,this.isFunction[t][e]=!0}},{key:"addEccAndInterleave",value:function(e){var t=this.version,n=this.errorCorrectionLevel;if(e.length!=r.getNumDataCodewords(t,n))throw new RangeError("Invalid argument");for(var i=r.NUM_ERROR_CORRECTION_BLOCKS[n.ordinal][t],o=r.ECC_CODEWORDS_PER_BLOCK[n.ordinal][t],a=Math.floor(r.getNumRawDataModules(t)/8),u=i-a%i,l=Math.floor(a/i),h=[],c=r.reedSolomonComputeDivisor(o),f=0,v=0;i>f;f++){var d=e.slice(v,v+l-o+(u>f?0:1));v+=d.length;var m=r.reedSolomonComputeRemainder(d,c);u>f&&d.push(0),h.push(d.concat(m))}for(var g=[],y=function(e){h.forEach((function(t,n){e==l-o&&u>n||g.push(t[e])}))},E=0;h[0].length>E;E++)y(E);return s(g.length==a),g}},{key:"drawCodewords",value:function(e){if(e.length!=Math.floor(r.getNumRawDataModules(this.version)/8))throw new RangeError("Invalid argument");for(var t=0,n=this.size-1;n>=1;n-=2){6==n&&(n=5);for(var i=0;this.size>i;i++)for(var o=0;2>o;o++){var u=n-o,l=0==(n+1&2)?this.size-1-i:i;!this.isFunction[l][u]&&8*e.length>t&&(this.modules[l][u]=a(e[t>>>3],7-(7&t)),t++)}}s(t==8*e.length)}},{key:"applyMask",value:function(e){if(0>e||e>7)throw new RangeError("Mask value out of range");for(var t=0;this.size>t;t++)for(var n=0;this.size>n;n++){var r=void 0;switch(e){case 0:r=(n+t)%2==0;break;case 1:r=t%2==0;break;case 2:r=n%3==0;break;case 3:r=(n+t)%3==0;break;case 4:r=(Math.floor(n/3)+Math.floor(t/2))%2==0;break;case 5:r=n*t%2+n*t%3==0;break;case 6:r=(n*t%2+n*t%3)%2==0;break;case 7:r=((n+t)%2+n*t%3)%2==0;break;default:throw Error("Unreachable")}!this.isFunction[t][n]&&r&&(this.modules[t][n]=!this.modules[t][n])}}},{key:"getPenaltyScore",value:function(){for(var e=0,t=0;this.size>t;t++){for(var n=!1,i=0,a=[0,0,0,0,0,0,0],u=0;this.size>u;u++)this.modules[t][u]==n?5==++i?e+=r.PENALTY_N1:i>5&&e++:(this.finderPenaltyAddHistory(i,a),n||(e+=this.finderPenaltyCountPatterns(a)*r.PENALTY_N3),n=this.modules[t][u],i=1);e+=this.finderPenaltyTerminateAndCount(n,i,a)*r.PENALTY_N3}for(var l=0;this.size>l;l++){for(var h=!1,c=0,f=[0,0,0,0,0,0,0],v=0;this.size>v;v++)this.modules[v][l]==h?5==++c?e+=r.PENALTY_N1:c>5&&e++:(this.finderPenaltyAddHistory(c,f),h||(e+=this.finderPenaltyCountPatterns(f)*r.PENALTY_N3),h=this.modules[v][l],c=1);e+=this.finderPenaltyTerminateAndCount(h,c,f)*r.PENALTY_N3}for(var d=0;this.size-1>d;d++)for(var m=0;this.size-1>m;m++){var g=this.modules[d][m];g==this.modules[d][m+1]&&g==this.modules[d+1][m]&&g==this.modules[d+1][m+1]&&(e+=r.PENALTY_N2)}var y,E=0,w=o(this.modules);try{for(w.s();!(y=w.n()).done;){E=y.value.reduce((function(e,t){return e+(t?1:0)}),E)}}catch(e){w.e(e)}finally{w.f()}var M=this.size*this.size,C=Math.ceil(Math.abs(20*E-10*M)/M)-1;return s(C>=0&&9>=C),s((e+=C*r.PENALTY_N4)>=0&&2568888>=e),e}},{key:"getAlignmentPatternPositions",value:function(){if(1==this.version)return[];for(var e=Math.floor(this.version/7)+2,t=32==this.version?26:2*Math.ceil((4*this.version+4)/(2*e-2)),n=[6],r=this.size-7;e>n.length;r-=t)n.splice(1,0,r);return n}},{key:"finderPenaltyCountPatterns",value:function(e){var t=e[1];s(3*this.size>=t);var n=t>0&&e[2]==t&&e[3]==3*t&&e[4]==t&&e[5]==t;return(!n||4*t>e[0]||t>e[6]?0:1)+(!n||4*t>e[6]||t>e[0]?0:1)}},{key:"finderPenaltyTerminateAndCount",value:function(e,t,n){return e&&(this.finderPenaltyAddHistory(t,n),t=0),this.finderPenaltyAddHistory(t+=this.size,n),this.finderPenaltyCountPatterns(n)}},{key:"finderPenaltyAddHistory",value:function(e,t){0==t[0]&&(e+=this.size),t.pop(),t.unshift(e)}}],[{key:"encodeText",value:function(e,n){var i=t.QrSegment.makeSegments(e);return r.encodeSegments(i,n)}},{key:"encodeBinary",value:function(e,n){var i=t.QrSegment.makeBytes(e);return r.encodeSegments([i],n)}},{key:"encodeSegments",value:function(e,t){var n,a,l=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,h=arguments.length>3&&void 0!==arguments[3]?arguments[3]:40,c=arguments.length>4&&void 0!==arguments[4]?arguments[4]:-1,f=5>=arguments.length||void 0===arguments[5]||arguments[5];if(r.MIN_VERSION>l||l>h||h>r.MAX_VERSION||-1>c||c>7)throw new RangeError("Invalid value");for(n=l;;n++){var v=8*r.getNumDataCodewords(n,t),d=u.getTotalBits(e,n);if(v>=d){a=d;break}if(n>=h)throw new RangeError("Data too long")}for(var m=0,g=[r.Ecc.MEDIUM,r.Ecc.QUARTILE,r.Ecc.HIGH];g.length>m;m++){var y=g[m];f&&a<=8*r.getNumDataCodewords(n,y)&&(t=y)}var E,w=[],M=o(e);try{for(M.s();!(E=M.n()).done;){var C=E.value;i(C.mode.modeBits,4,w),i(C.numChars,C.mode.numCharCountBits(n),w);var R,A=o(C.getData());try{for(A.s();!(R=A.n()).done;){var p=R.value;w.push(p)}}catch(e){A.e(e)}finally{A.f()}}}catch(e){M.e(e)}finally{M.f()}s(w.length==a);var P=8*r.getNumDataCodewords(n,t);s(P>=w.length),i(0,Math.min(4,P-w.length),w),i(0,(8-w.length%8)%8,w),s(w.length%8==0);for(var N=236;P>w.length;N^=253)i(N,8,w);for(var k=[];w.length>8*k.length;)k.push(0);return w.forEach((function(e,t){return k[t>>>3]|=e<<7-(7&t)})),new r(n,t,k,c)}},{key:"getNumRawDataModules",value:function(e){if(r.MIN_VERSION>e||e>r.MAX_VERSION)throw new RangeError("Version number out of range");var t=(16*e+128)*e+64;if(e>=2){var n=Math.floor(e/7)+2;t-=(25*n-10)*n-55,7>e||(t-=36)}return s(t>=208&&29648>=t),t}},{key:"getNumDataCodewords",value:function(e,t){return Math.floor(r.getNumRawDataModules(e)/8)-r.ECC_CODEWORDS_PER_BLOCK[t.ordinal][e]*r.NUM_ERROR_CORRECTION_BLOCKS[t.ordinal][e]}},{key:"reedSolomonComputeDivisor",value:function(e){if(1>e||e>255)throw new RangeError("Degree out of range");for(var t=[],n=0;e-1>n;n++)t.push(0);t.push(1);for(var i=1,o=0;e>o;o++){for(var a=0;t.length>a;a++)t[a]=r.reedSolomonMultiply(t[a],i),t.length>a+1&&(t[a]^=t[a+1]);i=r.reedSolomonMultiply(i,2)}return t}},{key:"reedSolomonComputeRemainder",value:function(e,t){var n,i=t.map((function(e){return 0})),a=o(e);try{var s=function(){var e=n.value^i.shift();i.push(0),t.forEach((function(t,n){return i[n]^=r.reedSolomonMultiply(t,e)}))};for(a.s();!(n=a.n()).done;)s()}catch(e){a.e(e)}finally{a.f()}return i}},{key:"reedSolomonMultiply",value:function(e,t){if(e>>>8!=0||t>>>8!=0)throw new RangeError("Byte out of range");for(var n=0,r=7;r>=0;r--)n=n<<1^285*(n>>>7),n^=(t>>>r&1)*e;return s(n>>>8==0),n}}]),r}();function i(e,t,n){if(0>t||t>31||e>>>t!=0)throw new RangeError("Value out of range");for(var r=t-1;r>=0;r--)n.push(e>>>r&1)}function a(e,t){return 0!=(e>>>t&1)}function s(e){if(!e)throw Error("Assertion error")}r.MIN_VERSION=1,r.MAX_VERSION=40,r.PENALTY_N1=3,r.PENALTY_N2=3,r.PENALTY_N3=40,r.PENALTY_N4=10,r.ECC_CODEWORDS_PER_BLOCK=[[-1,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],[-1,13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],[-1,17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30]],r.NUM_ERROR_CORRECTION_BLOCKS=[[-1,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25],[-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49],[-1,1,1,2,2,4,4,6,6,8,8,8,10,12,16,12,17,16,18,21,20,23,23,25,27,29,34,34,35,38,40,43,45,48,51,53,56,59,62,65,68],[-1,1,1,2,4,4,4,5,6,8,8,11,11,16,16,18,16,19,21,25,25,25,34,30,32,35,37,40,42,45,48,51,54,57,60,63,66,70,74,77,81]],t.QrCode=r;var u=function(){function t(n,r,i){if(e(this,t),this.mode=void 0,this.numChars=void 0,this.bitData=void 0,this.mode=n,this.numChars=r,this.bitData=i,0>r)throw new RangeError("Invalid argument");this.bitData=i.slice()}return n(t,[{key:"getData",value:function(){return this.bitData.slice()}}],[{key:"makeBytes",value:function(e){var n,r=[],a=o(e);try{for(a.s();!(n=a.n()).done;){i(n.value,8,r)}}catch(e){a.e(e)}finally{a.f()}return new t(t.Mode.BYTE,e.length,r)}},{key:"makeNumeric",value:function(e){if(!t.isNumeric(e))throw new RangeError("String contains non-numeric characters");for(var n=[],r=0;e.length>r;){var o=Math.min(e.length-r,3);i(parseInt(e.substring(r,r+o),10),3*o+1,n),r+=o}return new t(t.Mode.NUMERIC,e.length,n)}},{key:"makeAlphanumeric",value:function(e){if(!t.isAlphanumeric(e))throw new RangeError("String contains unencodable characters in alphanumeric mode");var n,r=[];for(n=0;e.length>=n+2;n+=2){var o=45*t.ALPHANUMERIC_CHARSET.indexOf(e.charAt(n));i(o+=t.ALPHANUMERIC_CHARSET.indexOf(e.charAt(n+1)),11,r)}return e.length>n&&i(t.ALPHANUMERIC_CHARSET.indexOf(e.charAt(n)),6,r),new t(t.Mode.ALPHANUMERIC,e.length,r)}},{key:"makeSegments",value:function(e){return""==e?[]:t.isNumeric(e)?[t.makeNumeric(e)]:t.isAlphanumeric(e)?[t.makeAlphanumeric(e)]:[t.makeBytes(t.toUtf8ByteArray(e))]}},{key:"makeEci",value:function(e){var n=[];if(0>e)throw new RangeError("ECI assignment value out of range");if(128>e)i(e,8,n);else if(16384>e)i(2,2,n),i(e,14,n);else{if(e>=1e6)throw new RangeError("ECI assignment value out of range");i(6,3,n),i(e,21,n)}return new t(t.Mode.ECI,0,n)}},{key:"isNumeric",value:function(e){return t.NUMERIC_REGEX.test(e)}},{key:"isAlphanumeric",value:function(e){return t.ALPHANUMERIC_REGEX.test(e)}},{key:"getTotalBits",value:function(e,t){var n,r=0,i=o(e);try{for(i.s();!(n=i.n()).done;){var a=n.value,s=a.mode.numCharCountBits(t);if(a.numChars>=1<<s)return 1/0;r+=4+s+a.bitData.length}}catch(e){i.e(e)}finally{i.f()}return r}},{key:"toUtf8ByteArray",value:function(e){e=encodeURI(e);for(var t=[],n=0;e.length>n;n++)"%"!=e.charAt(n)?t.push(e.charCodeAt(n)):(t.push(parseInt(e.substring(n+1,n+3),16)),n+=2);return t}}]),t}();u.NUMERIC_REGEX=/^[0-9]*$/,u.ALPHANUMERIC_REGEX=/^[A-Z0-9 $%*+.\/:-]*$/,u.ALPHANUMERIC_CHARSET="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:",t.QrSegment=u}(a||(a={})),function(t){!function(t){var r=n((function t(n,r){e(this,t),this.ordinal=void 0,this.formatBits=void 0,this.ordinal=n,this.formatBits=r}));r.LOW=new r(0,1),r.MEDIUM=new r(1,0),r.QUARTILE=new r(2,3),r.HIGH=new r(3,2),t.Ecc=r}(t.QrCode||(t.QrCode={}))}(a||(a={})),function(t){!function(t){var r=function(){function t(n,r){e(this,t),this.modeBits=void 0,this.numBitsCharCount=void 0,this.modeBits=n,this.numBitsCharCount=r}return n(t,[{key:"numCharCountBits",value:function(e){return this.numBitsCharCount[Math.floor((e+7)/17)]}}]),t}();r.NUMERIC=new r(1,[10,12,14]),r.ALPHANUMERIC=new r(2,[9,11,13]),r.BYTE=new r(4,[8,16,16]),r.KANJI=new r(8,[8,10,12]),r.ECI=new r(7,[0,0,0]),t.Mode=r}(t.QrSegment||(t.QrSegment={}))}(a||(a={}));var s=a,u=["value","size","level","bgColor","fgColor","includeMargin","marginSize","imageSettings"],l={L:s.QrCode.Ecc.LOW,M:s.QrCode.Ecc.MEDIUM,Q:s.QrCode.Ecc.QUARTILE,H:s.QrCode.Ecc.HIGH};function h(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=[];return e.forEach((function(e,r){var i=null;e.forEach((function(o,a){if(!o&&null!==i)return n.push("M".concat(i+t," ").concat(r+t,"h").concat(a-i,"v1H").concat(i+t,"z")),void(i=null);if(a!==e.length-1)o&&null===i&&(i=a);else{if(!o)return;n.push(null===i?"M".concat(a+t,",").concat(r+t," h1v1H").concat(a+t,"z"):"M".concat(i+t,",").concat(r+t," h").concat(a+1-i,"v1H").concat(i+t,"z"))}}))})),n.join("")}function c(e,t){return e.slice().map((function(e,n){return t.y>n||n>=t.y+t.h?e:e.map((function(e,n){return(t.x>n||n>=t.x+t.w)&&e}))}))}var f=function(){function t(n,r){var i=this;for(var o in e(this,t),this.canvas=void 0,this.pixelRatio="undefined"!=typeof window?window.devicePixelRatio:1,this.path2D=!0,this.SUPPORTS_PATH2D=void 0,this.createImage=function(){return new Image},this.createPath2D=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0,t="createPath2D";return i.canvas&&t in i.canvas?i.canvas[t](e):new Path2D(e)},this.canvas=n,r)o in this&&(this[o]=r[o]);this.SUPPORTS_PATH2D=function(){try{i.createPath2D()}catch(e){return!1}return!0}()}return n(t,[{key:"render",value:function(e,t){var n=this,i=e.value,o=e.size,a=void 0===o?128:o,f=e.level,v=void 0===f?"L":f,d=e.bgColor,m=void 0===d?"#FFFFFF":d,g=e.fgColor,y=void 0===g?"#000000":g,E=e.includeMargin,w=void 0!==E&&E,M=e.marginSize,C=e.imageSettings,R=(r(e,u),null==C?void 0:C.src),A=this.canvas,p=A.getContext("2d");if(p&&i){var P=s.QrCode.encodeText(i,l[v]).getModules(),N=function(e,t){return null!=t?Math.floor(t):e?4:0}(w,M),k=P.length+2*N,S=function(e,t,n,r){if(null==r)return null;var i=e.length+2*n,o=Math.floor(.1*t),a=i/t,s=(r.width||o)*a,u=(r.height||o)*a,l=null==r.x?e.length/2-s/2:r.x*a,h=null==r.y?e.length/2-u/2:r.y*a,c=null;if(r.excavate){var f=Math.floor(l),v=Math.floor(h);c={x:f,y:v,w:Math.ceil(s+l-f),h:Math.ceil(u+h-v)}}return{x:l,y:h,h:u,w:s,excavation:c}}(P,a,N,C),I=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,r=null!=S&&null!==e&&e.complete&&0!==e.naturalHeight&&0!==e.naturalWidth;r&&null!=S.excavation&&(P=c(P,S.excavation)),t&&t(P);var i=n.pixelRatio;p.clearRect(0,0,A.width,A.height),p.setTransform(1,0,0,1,0,0),A.height=A.width=a*i;var o=a/k*i;if(p.scale(o,o),p.fillStyle=m,p.fillRect(0,0,k,k),p.fillStyle=y,n.SUPPORTS_PATH2D&&n.path2D){var s=n.createPath2D(h(P,N));p.fill(s)}else P.forEach((function(e,t){e.forEach((function(e,n){e&&p.fillRect(n+N,t+N,1,1)}))}));var u=(null==e?void 0:e.path)||e;r&&p.drawImage(u,S.x+N,S.y+N,S.w,S.h),"draw"in p&&p.draw()};if(R){var b=this.createImage(A);b.onload=function(){I(b)},b.onerror=function(e){I(),console.warn(e)},b.src=R}else I()}}}]),t}();export{f as QRCodeCanvas};
