
export type BigNumberish = string | number | bigint;
export const TEXT_TO_FELT_MAX_LEN = 31;

/**
 * Test if string contains only ASCII characters (string can be ascii text)
 */
export function isASCII(str: string) {
    // eslint-disable-next-line no-control-regex
    return /^[\x00-\x7F]*$/.test(str);
}

/**
 * Test if string is a Cairo short string (string has less or equal 31 characters)
 */
export function isShortString(str: string) {
    return str.length <= TEXT_TO_FELT_MAX_LEN;
}

/**
 * Test if string contains only numbers (string can be converted to decimal number)
 */
export function isDecimalString(str: string): boolean {
    return /^[0-9]*$/i.test(str);
}

/**
 * Test if value is a free-from string text, and not a hex string or number string
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isText(val: any) {
    return typeof val === 'string' && !isHex(val) && !isStringWholeNumber(val);
}

/**
* Test if string is hex-string
* @param hex hex-string
*/
export function isHex(hex: string): boolean {
    return /^0x[0-9a-f]*$/i.test(hex);
}

/**
* Test if string is whole number (0, 1, 2, 3...)
*/
export const isStringWholeNumber = (value: string) => /^\d+$/.test(value);


/**
 * Test if value is short text
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isShortText = (val: any) => isText(val) && isShortString(val);

/**
 * Test if value is long text
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isLongText = (val: any) => isText(val) && !isShortString(val);

/**
* Add hex prefix '0x' to base16-string
* @param hex base16-string
* @returns format: hex-string
*/
export function addHexPrefix(hex: string): string {
    return `0x${removeHexPrefix(hex)}`;
}

/**
* Remove hex prefix '0x' from hex-string
* @param hex hex-string
* @returns format: base16-string
*/
export function removeHexPrefix(hex: string): string {
    return hex.replace(/^0x/i, '');
}


/**
 * Split long text into short strings
 */
export function splitLongString(longStr: string): string[] {
    const regex = RegExp(`[^]{1,${TEXT_TO_FELT_MAX_LEN}}`, 'g');
    return longStr.match(regex) || [];
}
export function encodeShortString(str: string): string {
    if (!isASCII(str)) throw new Error(`${str} is not an ASCII string`);
    if (!isShortString(str)) throw new Error(`${str} is too long`);
    return addHexPrefix(str.replace(/./g, (char) => char.charCodeAt(0).toString(16)));
}

export type ByteArray = {
    data: BigNumberish[];
    pending_word: BigNumberish;
    pending_word_len: BigNumberish;
};


export function byteArrayFromString(myString: string): ByteArray {
    // Convert utf8 to raw bytes first
    if (myString.length === 0) {
        return {
            data: ['0x00'],
            pending_word: '0x00',
            pending_word_len: 0,
        } as ByteArray;
    }
    const myShortStrings: string[] = splitLongString(myString);
    const remains: string = myShortStrings[myShortStrings.length - 1];
    const myShortStringsEncoded: BigNumberish[] = myShortStrings.map((shortStr) =>
        encodeShortString(shortStr)
    );
    if (remains.length === 31) {
        return {
            data: myShortStringsEncoded,
            pending_word: '0x00',
            pending_word_len: 0,
        } as ByteArray;
    }
    const pendingEncodedWord: BigNumberish = myShortStringsEncoded.pop()!;
    return {
        data: myShortStringsEncoded.length === 0 ? ['0x00'] : myShortStringsEncoded,
        pending_word: pendingEncodedWord,
        pending_word_len: remains.length,
    } as ByteArray;
}

export function decodeShortString(str: string): string {
    if (!isASCII(str)) throw new Error(`${str} is not an ASCII string`);
    if (isHex(str)) {
        return removeHexPrefix(str).replace(/.{2}/g, (hex) => String.fromCharCode(parseInt(hex, 16)));
    }
    if (isDecimalString(str)) {
        return decodeShortString('0X'.concat(BigInt(str).toString(16)));
    }
    throw new Error(`${str} is not Hex or decimal`);
}

/**
* Convert BigNumberish to hex-string
* @returns format: hex-string
*/
export function toHex(number: BigNumberish): string {
    return addHexPrefix(toBigInt(number).toString(16));
}
/*
  * Convert BigNumberish to bigint
  */
export function toBigInt(value: BigNumberish): bigint {
    return BigInt(value);
}

/**
 * convert a Cairo ByteArray to a JS string
 * @param myByteArray Cairo representation of a LongString
 * @returns a JS string
 * @example
 * ```typescript
 * const myByteArray = {
 *    data: [ '0x00' ],
 *    pending_word: '0x414243444546474849',
 *    pending_word_len: 9
 * }
 * const result: String = stringFromByteArray(myByteArray); // ABCDEFGHI
 * ```
 */
export function stringFromByteArray(myByteArray: ByteArray): string {
    const pending_word: string =
        BigInt(myByteArray.pending_word) === 0n
            ? ''
            : decodeShortString(toHex(myByteArray.pending_word));
    return (
        myByteArray.data.reduce<string>((cumuledString, encodedString: BigNumberish) => {
            const add: string =
                BigInt(encodedString) === 0n ? '' : decodeShortString(toHex(encodedString));
            return cumuledString + add;
        }, '') + pending_word
    );
}
