package main

import(
	"fmt"
	"crypto/sha1"
	"encoding/json"
	
	"github.com/gocolly/colly"
)

type product struct {
	Hash string `json:"hash,omitempty"`
	Image string `json:"image,omitempty"`
	Description string `json:"description,omitempty"`
	Rating string `json:"rating,omitempty"`
	Reviews string `json:"reviews,omitempty"`
	PriceDollars string `json:"price_dollars,omitempty"`
	PriceCents string `json:"price_cents,omitempty"`
	Stock string `json:"stock,omitempty"`
}

func createHash(str string) string {
	h := sha1.New()
	h.Write([]byte(str))
	bs := h.Sum(nil)
	
	return fmt.Sprintf("%x", bs)
}

func main() {
	c := colly.NewCollector(
		colly.UserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0"),
	)
	
	site := "https://www.amazon.com/s?k=nodejs"
	products := []product{}
	
	c.OnHTML(".s-result-item", func(e *colly.HTMLElement) {
		products = append(products, product{
			Hash: createHash(e.ChildAttr("img.s-image","src")),
			Image: e.ChildAttr("img.s-image","src"),
			Description: e.ChildText(".s-line-clamp-4 span.a-text-normal"),//fix
			Rating: e.ChildText(".a-icon-star-small .a-icon-alt"),
			Reviews: e.ChildText(".a-section  .a-size-small .a-link-normal .a-size-base"),
			PriceDollars: e.ChildText(".a-price-whole"),
			PriceCents: e.ChildText(".a-price-fraction"),
			Stock: e.ChildText("span[data-action=s-show-all-offers-display] a.a-link-normal"),			
		})
	})
	/*
		c.OnRequest(func(r *colly.Request) {
			fmt.Println("Visiting: ", site)
		})
	*/
	
	_ = c.Visit(site)
	//if err != nil { fmt.Println(err); return }	
	c.Wait()
	//fmt.Println(products)
	
	j, _ := json.Marshal(products)
	//if err != nil {  fmt.Println(err); return }
	
	fmt.Println(string(j))
}