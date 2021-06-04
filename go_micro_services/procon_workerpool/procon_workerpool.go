//https://github.com/syafdia/go-exercise
package procon_workerpool

import(
	"fmt"
)

// T is a type alias to accept any type.
type T = interface{}

// Executor is a type alias for Worker Pool parameter.
type Executor = func() (T, error)

// Task will hold wrapped function which will
// be processed by Worker Pool.
type Task struct {
	ID       string
	Result   T
	Err      error
	executor Executor
}

func NewTask(id string, executor Executor) *Task {
	return &Task{
		ID:       id,
		executor: executor,
	}
}

// Execute will run wrapped function on Task instance
// and set the Result & Error property.
func (t *Task) Execute() {
	t.Result, t.Err = t.executor()
}

// WorkerPool is a contract for Worker Pool implementation
type WorkerPool interface {
	Run()
	AddTasks(tasks []*Task)
	GetProcessedTask() chan *Task
	GetTotalQueuedTask() int
}

type workerPool struct {
	maxWorker      int
	taskC          chan *Task
	queuedTaskC    chan *Task
	processedTaskC chan *Task
}

// NewWorkerPool will create an instance of WorkerPool.
func NewWorkerPool(maxWorker int) WorkerPool {
	wp := &workerPool{
		maxWorker:      maxWorker,
		queuedTaskC:    make(chan *Task),
		processedTaskC: make(chan *Task),
	}

	return wp
}

func (wp *workerPool) Run() {
	wp.run()	
}

func (wp *workerPool) AddTask(id string, executor Executor) {
	go func() {
		task := &Task{
			ID:       id,
			executor: executor,
		}
		wp.queuedTaskC <- task
	}()

	fmt.Printf("[WorkerPool] Task %s has been added", id)
}

func (wp *workerPool) AddTasks(tasks []*Task) {
	go func() {
		for _, task := range tasks {
			wp.queuedTaskC <- task
		}

	}()
}

func (wp *workerPool) GetTotalQueuedTask() int {
	return len(wp.queuedTaskC)
}

func (wp *workerPool) GetProcessedTask() chan *Task {
	return wp.processedTaskC
}

func (wp *workerPool) run() {
	for i := 0; i < wp.maxWorker; i++ {
		go func(workerID int) {
			for task := range wp.queuedTaskC {
				fmt.Printf("[WorkerPool] Worker %d start task %s \n", workerID, task.ID)

				task.Execute()
				wp.processedTaskC <- task

				fmt.Printf("[WorkerPool] Worker %d finished task %s \n", workerID, task.ID)
			}
		}(i + 1)
	}
}




