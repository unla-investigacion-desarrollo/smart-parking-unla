package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"smartParkingBack/internal/database"
	"smartParkingBack/internal/firebase"
	"smartParkingBack/internal/rutines"
	"syscall"
)

func main() {
	ctx, stop := signal.NotifyContext(
		context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
	)
	defer stop()
	database.Connect()
	firebase.InitFirebase(ctx)
	go rutines.StartMQTT(ctx)
	go rutines.StartCron(ctx)
	log.Println("services started, blocking forever")

	<-ctx.Done() // ⬅️ THIS LINE IS REQUIRED

	log.Println("shutdown signal received")
}
