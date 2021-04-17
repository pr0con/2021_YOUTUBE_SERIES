package procon_data

import()

type Msg struct{
	Jwt string `json:"jwt"`
	Type string `json:"type"`
	Data string `json:"data"`
}

type RespMsg struct {	
	Type string `json:"type"`
	Success string `json:"success"`
	Data string `json:"data"`	
}