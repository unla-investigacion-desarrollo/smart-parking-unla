package mqtt

import (
	"crypto/tls"
	"fmt"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type Client struct {
	client mqtt.Client
}

type Config struct {
	Host     string
	Port     int
	Username string
	Password string
	Topic    string
	UseTLS   bool
}

// NewClient creates and configures the MQTT client.
func NewClient(cfg Config) (*Client, error) {
	opts := mqtt.NewClientOptions()
	broker := fmt.Sprintf("tcp://%s:%d", cfg.Host, cfg.Port)

	if cfg.UseTLS {
		broker = fmt.Sprintf("tls://%s:%d", cfg.Host, cfg.Port)
		opts.SetTLSConfig(&tls.Config{
			InsecureSkipVerify: true, // optional
		})
	}

	opts.AddBroker(broker)
	opts.SetUsername(cfg.Username)
	opts.SetPassword(cfg.Password)

	opts.SetAutoReconnect(true)
	opts.SetConnectRetry(true)
	opts.SetConnectRetryInterval(2 * time.Second)

	opts.SetConnectionLostHandler(func(c mqtt.Client, err error) {
		fmt.Println("MQTT connection lost:", err)
	})

	opts.SetOnConnectHandler(func(c mqtt.Client) {
		fmt.Println("MQTT connected")
	})

	client := mqtt.NewClient(opts)
	token := client.Connect()
	if token.Wait() && token.Error() != nil {
		return nil, token.Error()
	}

	return &Client{client: client}, nil
}

// Subscribe starts listening to a topic and calls handler on every message.
func (c *Client) Subscribe(topic string, handler func(msg []byte)) error {
	token := c.client.Subscribe(topic, 0, func(_ mqtt.Client, m mqtt.Message) {
		handler(m.Payload())
	})
	token.Wait()
	return token.Error()
}

// Close disconnects the MQTT client.
func (c *Client) Close() {
	c.client.Disconnect(250)
}
