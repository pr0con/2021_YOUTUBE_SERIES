package procon_tokenc

import (
	"crypto/aes"
	"crypto/rand"
	"crypto/cipher"
	
	"golang.org/x/crypto/scrypt"
)

func DeriveKey2(password, salt []byte) ( []byte, []byte, error ) {
	if salt == nil {
		salt = make([]byte, 32)	
		if _, err := rand.Read(salt); err != nil {
			return nil, nil, err
		}
	}
	
	key, err := scrypt.Key(password, salt, 32768, 8, 1, 32)
	if err != nil { return nil,nil, err; }
	
	return key, salt, nil;
}

func Encrypt2(uuid_key, data []byte) ( []byte, []byte, error ) {
	key, salt, err := DeriveKey2(uuid_key, nil)
	if err != nil { return nil,nil, err; }

	blockCipher, err := aes.NewCipher(key)
	if err != nil { return nil,nil, err; } 

	gcm, err := cipher.NewGCM(blockCipher)
	if err != nil { return nil,nil, err; } 
	
	nonce := make([]byte, gcm.NonceSize())
	if _, err = rand.Read(nonce); err != nil { return nil,nil, err; }
	
	ciphertext := gcm.Seal(nonce, nonce, data, nil)
	
	return ciphertext, salt, nil
}

func Decrypt2(key, salt, data []byte) ( []byte, error ) {
	key, _, err := DeriveKey2(key,salt)
	if err != nil {	return nil, err; }
	
	blockCipher, err := aes.NewCipher(key)
	if err != nil {	return nil, err; }
	
	gcm, err := cipher.NewGCM(blockCipher)
	if err != nil {	return nil, err; }
	
	nonce, ciphertext := data[:gcm.NonceSize()], data[gcm.NonceSize():]
	
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {	return nil, err; }
	
	return plaintext, nil
}



