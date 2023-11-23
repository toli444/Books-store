import { Request, Response } from 'express';
import { orderProcessedEventProducer } from '../../config/kafka.config';
import { HttpStatusCode } from '../../utils/AppError';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

class StatusController {
  public get = async (req: Request, res: Response) => {
    await orderProcessedEventProducer.sendOrderProcessedEvent(
      `${getRandomInt(100000)}`,
      `Hello ${getRandomInt(100000)}`
    );

    res.status(HttpStatusCode.OK).json({
      message: 'OK'
    });
  };
}

export default StatusController;
