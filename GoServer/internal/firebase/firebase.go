package firebase

import (
	"context"
	"fmt"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

var Client *firestore.Client

func InitFirebase(ctx context.Context) {
	opt := option.WithCredentialsFile(os.Getenv("FIREBASE_SERVICE_ACCOUNT_PATH"))

	// Initialize the Firebase app
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}

	// Now you can access specific Firebase services using the app instance
	// For example, to use Firestore:
	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatal(err)
	}
	Client = client

	fmt.Println("Firebase app initialized successfully")
}
