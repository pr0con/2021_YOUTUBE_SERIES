package procon_wsfs

import (
	"os"
	"fmt"
	"time"
	"path/filepath"
)

type FileInfo struct {
	Name    string      `json:"name"`
	Size    int64       `json:"size"`
	Mode    os.FileMode `json:"mode"`
	ModTime time.Time   `json:"mod_time"`
	IsDir   bool        `json:"is_dir"`
}


func fileInfoFromInterface(v os.FileInfo) *FileInfo {
	return &FileInfo{v.Name(), v.Size(), v.Mode(), v.ModTime(), v.IsDir()}
}

type Node struct {
	FullPath string    `json:"path"`
	Info     *FileInfo `json:"info"`
	Children []*Node   `json:"children"`
	Parent   *Node     `json:"-"`
}

func NewTree(root string) (result *Node, err error) {
	absRoot := root;
	fmt.Println(absRoot)
	
	if err != nil {
		fmt.Println(err)
		return
	}
	
	parents := make(map[string]*Node)
	walkFunc := func(path string, info os.FileInfo, err error) error {
		
		if err != nil {
			return err
		}
		
		/* The Added Magic that makes this one leve Single Level Deep :: ZIL */
		parentPath := filepath.Dir(path) 
		//fmt.Println(parentPath)
		if(parentPath != root && path != root) {
			return filepath.SkipDir
		}
		/*End the Magic */
		
		parents[path] = &Node{
			FullPath: path,
			Info:     fileInfoFromInterface(info),
			Children: make([]*Node, 0),
		}
		return nil
	}
	
	if err = filepath.Walk(absRoot, walkFunc); err != nil {
		return
	}
	
	for path, node := range parents {
		parentPath := filepath.Dir(path)
		parent, exists := parents[parentPath]
		if !exists { // If a parent does not exist, this is the root.
			result = node
		} else {
			node.Parent = parent
			parent.Children = append(parent.Children, node)
		}
	}
	
	return				
}

/* Special Funcs */
func GetDirectory(p string) (*Node, error) {
	root, err := NewTree(p)
	if err != nil { return nil, err}	
	
	return root, nil
}

